using asp_backend.Data;
using asp_backend.DTOs;
using asp_backend.Models;
using asp_backend.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static asp_backend.Models.Enums.OrderStatusPrio;

namespace asp_backend.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrderController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(OrderDto dto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed",
                    errors = ModelState
                        .Where(x => x.Value!.Errors.Count > 0)
                        .ToDictionary(
                            k => k.Key,
                            v => v.Value!.Errors.Select(e => e.ErrorMessage)
                        )
                });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // ✅ Validate staff via Identity
                var assignedStaff = await _userManager
                    .FindByIdAsync(dto.AssignedStaffId!);

                if (assignedStaff == null)
                    return BadRequest("Assigned staff not found.");
                var order = new Order
                {
                    OrderNumber = $"ORD-{DateTime.UtcNow.Ticks}",
                    CustomerName = dto.CustomerName,
                    CustomerEmail = dto.CustomerEmail,
                    CustomerPhone = dto.CustomerPhone,
                    CustomerAddress = dto.CustomerAddress,
                    AssignedStaffId = dto.AssignedStaffId,
                    EstimatedDelivery = dto.EstimatedDelivery,
                    Status = dto.Status,
                    PriorityLevel = dto.PriorityLevel,
                    Notes = dto.Notes!,
                    CreatedAt = DateTime.UtcNow,
                    OrderProducts = new List<OrderProducts>()
                };

                var totalAmount = 0m;

                foreach (var item in dto.Products)
                {
                    var product = await _context.Products
                        .FirstOrDefaultAsync(p => p.Id == item.ProductId);

                    if (product == null)
                        return NotFound($"Product {item.ProductId} not found.");

                    if (product.StockQuantity < item.Quantity)
                        return BadRequest($"Not enough stock for {product.Name}");

                    var lineTotal = product.Price * item.Quantity;
                    totalAmount += lineTotal;

                    var orderProduct = new OrderProducts
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        Total = lineTotal
                    };

                    order.OrderProducts.Add(orderProduct);

                    // 🔥 Deduct stock
                    product.StockQuantity -= item.Quantity;
                }

                order.TotalAmount = totalAmount;

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { OrderNumber = order.OrderNumber });
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Order creation failed.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .Include(o => o.AssignedStaff)
                .ToListAsync();

            var result = orders.Select(o => new
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                Customer = new
                {
                    Name = o.CustomerName,
                    Email = o.CustomerEmail,
                    Address = o.CustomerAddress,
                    Phone = o.CustomerPhone,
                },
                AssignedStaffId = o.AssignedStaffId,
                AssignedStaffName = o.AssignedStaff?.UserName,
                Products = o.OrderProducts.Select(op => new OrderProductResponseDto
                {
                    Id = op.ProductId,
                    ProductName = op.Product.Name,
                    ProductDescription = op.Product.Description,
                    Sku = op.Product.SKU,
                    Quantity = op.Quantity,
                    Price = op.Product.Price,
                    Total = op.Product.Price * op.Quantity
                }).ToList(),
                TotalAmount = o.TotalAmount,
                PriorityLevel = o.PriorityLevel,
                Status = o.Status.ToString(),
                EstimatedDelivery = o.EstimatedDelivery,
                CreatedAt = o.CreatedAt
            });

            return Ok(result);
        }

        [HttpGet("{orderNumber}")]
        public async Task<IActionResult> GetOrderByOrderNumber(string orderNumber)
        {
            if (string.IsNullOrWhiteSpace(orderNumber))
                return BadRequest("Order number is required.");

            var order = await _context.Orders
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .Include(o => o.AssignedStaff)
                .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

            if (order == null)
                return NotFound($"Order {orderNumber} not found.");

            var response = new
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                CustomerPhone = order.CustomerPhone,
                CustomerAddress = order.CustomerAddress,
                
                OrderProducts = order.OrderProducts.Select(op => new OrderProductResponseDto
                {
                    ProductName = op.Product.Name,
                    ProductDescription = op.Product.Description,
                    Quantity = op.Quantity,
                    Price = op.Product.Price,
                    Total = op.Product.Price * op.Quantity
                }).ToList(),
                Status = order.Status.ToString(),
                PriorityLevel = order.PriorityLevel.ToString(),
                TotalAmount = order.TotalAmount,
                EstimatedDelivery = order.EstimatedDelivery,
                AssignedStaffName = order.AssignedStaff?.UserName,
                Notes = order.Notes
            };

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, UpdateOrderDto dto)
        {
            // Start a transaction
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderProducts)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound("Order not found.");

                if (order.Status == OrderStatus.Delivered)
                    return BadRequest("Delivered orders cannot be modified.");

                // Validate assigned staff if provided
                if (!string.IsNullOrWhiteSpace(dto.AssignedStaffId))
                {
                    var staff = await _userManager.FindByIdAsync(dto.AssignedStaffId);
                    if (staff == null)
                        return BadRequest("Staff not found.");

                    var staffRoles = await _userManager.GetRolesAsync(staff);
                    if (!staffRoles.Contains("Warehouse Staff") &&
                        !staffRoles.Contains("Delivery Staff"))
                    {
                        return BadRequest("User must be Warehouse or Delivery staff.");
                    }

                    order.AssignedStaffId = staff.Id;
                }

                // Update basic order fields
                order.CustomerName = dto.CustomerName;
                order.CustomerEmail = dto.CustomerEmail;
                order.CustomerPhone = dto.CustomerPhone;
                order.CustomerAddress = dto.CustomerAddress;
                order.Status = dto.Status;
                order.PriorityLevel = dto.PriorityLevel;
                order.EstimatedDelivery = dto.EstimatedDelivery ?? order.EstimatedDelivery;
                order.Notes = dto.Notes ?? order.Notes;

                // Handle products & stock
                if (dto.Products != null)
                {
                    var existingOrderProducts = order.OrderProducts.ToList();

                    foreach (var dtoItem in dto.Products)
                    {
                        var product = await _context.Products.FindAsync(dtoItem.ProductId);
                        if (product == null)
                            return BadRequest($"Product {dtoItem.ProductId} not found.");

                        var existingItem = existingOrderProducts
                            .FirstOrDefault(op => op.ProductId == dtoItem.ProductId);

                        if (existingItem != null)
                        {
                            // Quantity difference
                            int difference = dtoItem.Quantity - existingItem.Quantity;

                            if (difference > 0)
                            {
                                if (product.StockQuantity < difference)
                                    return BadRequest($"Insufficient stock for {product.Name}");

                                product.StockQuantity -= difference;
                            }
                            else if (difference < 0)
                            {
                                product.StockQuantity += Math.Abs(difference);
                            }

                            existingItem.Quantity = dtoItem.Quantity;
                            existingItem.Product.Price = product.Price;
                            existingItem.Total = product.Price * dtoItem.Quantity;
                        }
                        else
                        {
                            // New product added
                            if (product.StockQuantity < dtoItem.Quantity)
                                return BadRequest($"Insufficient stock for {product.Name}");

                            product.StockQuantity -= dtoItem.Quantity;

                            order.OrderProducts.Add(new OrderProducts
                            {
                                OrderId = order.Id,
                                ProductId = product.Id,
                                Product = product,
                                Quantity = dtoItem.Quantity,
                                Total = product.Price * dtoItem.Quantity
                            });
                        }
                    }

                    // Remove products that are not in DTO
                    var dtoProductIds = dto.Products.Select(p => p.ProductId).ToList();
                    var removedProducts = existingOrderProducts
                        .Where(op => !dtoProductIds.Contains(op.ProductId))
                        .ToList();

                    foreach (var removed in removedProducts)
                    {
                        var product = await _context.Products.FindAsync(removed.ProductId);
                        product?.StockQuantity += removed.Quantity;

                        _context.OrderProducts.Remove(removed);
                    }

                    // Recalculate total
                    order.TotalAmount = order.OrderProducts.Sum(op => op.Quantity * op.Product.Price);
                }

                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                return Ok("Order updated successfully.");
            }
            catch (Exception ex)
            {
                // Rollback on error
                await transaction.RollbackAsync();
                return BadRequest($"Error updating order: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .FindAsync(id);
            if (order == null) return NotFound(new { message = "Order not exist." });

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Order deleted successfully" });
        }

        //[Authorize(Roles = "Admin,Warehouse,Delivery")]
        [HttpPatch("{orderNumber}/status")]
        public async Task<IActionResult> UpdateOrderStatus(string orderNumber, UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

            if (order == null)
                return NotFound("Order not found.");

            // 🚫 Prevent invalid transitions (example)
            if (order.Status == OrderStatus.Delivered)
                return BadRequest("Delivered orders cannot be modified.");

            //// Optional: role-based restrictions
            //var currentUser = await _userManager.GetUserAsync(User);
            //var roles = await _userManager.GetRolesAsync(currentUser!);

            //bool isWarehouse = roles.Contains("Warehouse Staff");
            //bool isDelivery = roles.Contains("Delivery Staff");
            //bool isAdmin = roles.Contains("Admin");

            //if (!isAdmin)
            //{
            //    if (isWarehouse &&
            //       !(dto.Status == OrderStatus.Processing ||
            //         dto.Status == OrderStatus.Shipped))
            //    {
            //        return Forbid("Warehouse cannot set this status.");
            //    }

            //    if (isDelivery &&
            //       !(dto.Status == OrderStatus.Shipped ||
            //         dto.Status == OrderStatus.Delivered))
            //    {
            //        return Forbid("Delivery cannot set this status.");
            //    }
            //}

            order.Status = dto.Status;

            await _context.SaveChangesAsync();

            return Ok( new { message = "Order status updated successfully." });
        }
    }
}
