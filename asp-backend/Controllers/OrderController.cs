using asp_backend.Data;
using asp_backend.DTOs;
using asp_backend.Models;
using asp_backend.Models.Enums;
using asp_backend.Services;
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
        private readonly RouteService _routeService;
        private readonly IConfiguration _config;

        public OrderController(AppDbContext context, UserManager<ApplicationUser> userManager, RouteService routeService, IConfiguration config)
        {
            _context = context;
            _userManager = userManager;
            _routeService = routeService;
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(OrderDto dto)
        {

            if (dto == null)
                return BadRequest("Request body is required.");

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
                var customerAddress = dto.CustomerAddress;
                if (string.IsNullOrWhiteSpace(customerAddress))
                    return BadRequest("CustomerAddress is required.");

                // ✅ Validate staff via Identity
                var assignedStaff = await _userManager
                    .FindByIdAsync(dto.AssignedStaffId!);

                if (assignedStaff == null)
                    return BadRequest("Assigned staff not found.");
                double lat, lng;

                if (dto.CustomerLat.HasValue && dto.CustomerLng.HasValue)
                {
                    lat = dto.CustomerLat.Value;
                    lng = dto.CustomerLng.Value;
                }
                else
                {
                    (lat, lng) = await _routeService.Geocode(customerAddress);
                }

                double warehouseLat = double.Parse(_config["Warehouse:Latitude"]!);
                double warehouseLng = double.Parse(_config["Warehouse:Longitude"]!);

                var (distance, duration) = await _routeService.GetRoute(warehouseLat, warehouseLng, lat, lng);
                var order = new Order
                {
                    OrderNumber = $"ORD-{DateTime.UtcNow.Ticks}",
                    CustomerName = dto.CustomerName,
                    CustomerEmail = dto.CustomerEmail,
                    CustomerPhone = dto.CustomerPhone,
                    CustomerAddress = customerAddress,
                    CustomerLat = lat,
                    CustomerLng = lng,
                    DistanceKm = distance,
                    DurationMinutes = duration,
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

                var result = new
                {
                    Id = order.Id,
                    OrderNumber = order.OrderNumber,
                    Customer = new
                    {
                        Name = order.CustomerName,
                        Email = order.CustomerEmail,
                        Address = order.CustomerAddress,
                        Phone = order.CustomerPhone,
                        Latitude = order.CustomerLat,
                        Longitude = order.CustomerLng,
                        DistanceKm = order.DistanceKm,
                        DurationMinutes = order.DurationMinutes
                    },
                    AssignedStaffId = order.AssignedStaffId,
                    AssignedStaffName = order.AssignedStaff?.UserName,
                    Products = order.OrderProducts.Select(op => new OrderProductResponseDto
                    {
                        Id = op.ProductId,
                        ProductName = op.Product.Name,
                        ProductDescription = op.Product.Description,
                        Sku = op.Product.SKU,
                        Quantity = op.Quantity,
                        Price = op.Product.Price,
                        Total = op.Product.Price * op.Quantity
                    }).ToList(),
                    TotalAmount = order.TotalAmount,
                    PriorityLevel = order.PriorityLevel,
                    Status = order.Status.ToString(),
                    EstimatedDelivery = order.EstimatedDelivery,
                    CreatedAt = order.CreatedAt
                };

                return Ok(result);
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Order creation failed.");
            }
        }

        [HttpGet("reverse-geocode")]
        public async Task<IActionResult> ReverseGeocode(double lat, double lng)
        {
            var address = await _routeService.ReverseGeocode(lat, lng);
            return Ok(new { address });
        }

        [HttpGet("warehouse-location")]
        public IActionResult GetWarehouseLocation()
        {
            if (!double.TryParse(_config["Warehouse:Latitude"], out var lat) ||
                !double.TryParse(_config["Warehouse:Longitude"], out var lng))
            {
                return StatusCode(500, "Warehouse location is not configured.");
            }

            return Ok(new { lat, lng });
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
                    Latitude = o.CustomerLat,
                    Longitude = o.CustomerLng,
                    DistanceKm = o.DistanceKm,
                    DurationMinutes = o.DurationMinutes
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
                Notes = o.Notes,
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
                Customer = new
                {
                    Name = order.CustomerName,
                    Email = order.CustomerEmail,
                    Address = order.CustomerAddress,
                    Phone = order.CustomerPhone,
                    Latitude = order.CustomerLat,
                    Longitude = order.CustomerLng,
                    DistanceKm = order.DistanceKm,
                    DurationMinutes = order.DurationMinutes
                },
                AssignedStaffId = order.AssignedStaffId,
                AssignedStaffName = order.AssignedStaff?.UserName,
                Products = order.OrderProducts.Select(op => new OrderProductResponseDto
                {
                    Id = op.ProductId,
                    ProductName = op.Product.Name,
                    ProductDescription = op.Product.Description,
                    Sku = op.Product.SKU,
                    Quantity = op.Quantity,
                    Price = op.Product.Price,
                    Total = op.Product.Price * op.Quantity
                }).ToList(),
                TotalAmount = order.TotalAmount,
                PriorityLevel = order.PriorityLevel,
                Status = order.Status.ToString(),
                EstimatedDelivery = order.EstimatedDelivery,
                CreatedAt = order.CreatedAt
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
                if (dto == null)
                    return BadRequest("Request body is required.");

                var order = await _context.Orders
                    .Include(o => o.OrderProducts)
                        .ThenInclude(op => op.Product)
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
                var oldAddress = order.CustomerAddress;
                order.CustomerName = dto.CustomerName;
                order.CustomerEmail = dto.CustomerEmail;
                order.CustomerPhone = dto.CustomerPhone;
                order.CustomerAddress = dto.CustomerAddress;
                order.Status = dto.Status;
                order.PriorityLevel = dto.PriorityLevel;
                order.EstimatedDelivery = dto.EstimatedDelivery ?? order.EstimatedDelivery;
                order.Notes = dto.Notes ?? order.Notes;

                var newAddress = dto.CustomerAddress?.Trim();
                var previousAddress = oldAddress?.Trim();
                var addressChanged = !string.Equals(newAddress, previousAddress, StringComparison.OrdinalIgnoreCase);
                var hasNewCoordinates = dto.CustomerLat.HasValue && dto.CustomerLng.HasValue;

                if (addressChanged || hasNewCoordinates)
                {
                    if (string.IsNullOrWhiteSpace(dto.CustomerAddress))
                        return BadRequest("CustomerAddress is required.");

                    double lat;
                    double lng;

                    if (hasNewCoordinates)
                    {
                        lat = dto.CustomerLat!.Value;
                        lng = dto.CustomerLng!.Value;
                    }
                    else
                    {
                        (lat, lng) = await _routeService.Geocode(dto.CustomerAddress);
                    }

                    double warehouseLat = double.Parse(_config["Warehouse:Latitude"]!);
                    double warehouseLng = double.Parse(_config["Warehouse:Longitude"]!);

                    var (distance, duration) = await _routeService.GetRoute(warehouseLat, warehouseLng, lat, lng);

                    order.CustomerLat = lat;
                    order.CustomerLng = lng;
                    order.DistanceKm = distance;
                    order.DurationMinutes = duration;
                }

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

                return Ok(new
                {
                    message = "Order updated successfully.",
                    orderId = order.Id,
                    distanceKm = order.DistanceKm,
                    durationMinutes = order.DurationMinutes
                });
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

            order.Status = dto.Status;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Order status updated successfully." });
        }
    }
}
