using asp_backend.Data;
using asp_backend.DTOs;
using asp_backend.Models;
using asp_backend.Models.Enums;
using asp_backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static asp_backend.Models.Enums.OrderStatusPrio;

namespace asp_backend.Controllers
{
    [Route("api/deliveries")]
    [ApiController]
    public class DeliveryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly DeliveryService _deliveryService;

        public DeliveryController(AppDbContext context, UserManager<ApplicationUser> userManager, DeliveryService deliveryService)
        {
            _context = context;
            _userManager = userManager;
            _deliveryService = deliveryService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateDelivery([FromBody] DeliveryDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Request body is required" });
            }

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

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == dto.OrderId);
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            if (order.Status == OrderStatus.Delivered)
            {
                return BadRequest(new { message = "Delivered orders cannot be modified" });
            }

            string dNumber = await _deliveryService.GenerateDeliveryNumberAsync();
            var delivery = new Delivery
            {
                DeliveryNumber = dNumber,
                OrderId = dto.OrderId,
                Notes = dto.Notes,
            };

            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _context.Deliveries.Add(delivery);

                // Keep Orders table in sync with delivery lifecycle
                order.Status = OrderStatus.ForDelivery;
                order.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
            return Ok(new { message = "Delivery created successfully", deliveryId = delivery.Id });
        }



        [HttpGet]
        public async Task<IActionResult> GetDeliveries()
        {
            
            var deliveries = await _context.Deliveries
                .Include(d => d.Order)
                .Include(d => d.Driver)
                .Select(d => new
                {
                    d.Id,
                    d.DeliveryNumber,
                    d.OrderId,
                    d.DriverId,
                    d.ScheduledDate,
                    d.ScheduledTime,
                    OrderDetails = new
                    {
                        d.Order.OrderNumber,
                        d.Order.CustomerName,
                        d.Order.CustomerEmail,
                        d.Order.CustomerPhone,
                        d.Order.CustomerAddress,
                        d.Order.DistanceKm,
                        d.Order.DurationMinutes,
                        d.Order.TotalAmount,
                        d.Order.Status,
                        d.Order.PriorityLevel,
                        d.Order.EstimatedDelivery
                    },
                    DriverDetails = d.Driver == null
                        ? new
                        {
                            Id = (string?)null,
                            UserName = (string?)null,
                            Email = (string?)null,
                            PhoneNumber = (string?)null
                        }
                        : new
                        {
                            Id = (string?)d.Driver.Id,
                            UserName = d.Driver.UserName,
                            Email = d.Driver.Email,
                            PhoneNumber = d.Driver.PhoneNumber
                        },
                    Status = d.Status.ToString().Replace('_', ' '),
                    d.Notes,
                    d.CreatedAt,
                    d.UpdatedDate
                })
                .ToListAsync();
            return Ok(deliveries);
        }

        [HttpPatch("{deliveryId}/status")]
        public async Task<IActionResult> UpdateDeliveryStatus(int deliveryId, [FromBody] UpdateDeliveryStatusDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Request body is required" });
            }

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

            var existingDelivery = await _context.Deliveries
                .FirstOrDefaultAsync(d => d.Id == deliveryId);

            if (existingDelivery == null)
            {
                return NotFound(new { message = "Delivery not found" });
            }

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == existingDelivery.OrderId);
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            if (order.Status == OrderStatus.Delivered)
            {
                return BadRequest(new { message = "Delivered orders cannot be modified" });
            }

            var normalized = dto.Status
                .Trim()
                .Replace("_", "")
                .Replace(" ", "")
                .ToLowerInvariant();

            DeliveryStatus? newStatus = normalized switch
            {
                "pending" => DeliveryStatus.Pending,
                "assigned" => DeliveryStatus.Assigned,
                "intransit" => DeliveryStatus.In_Transit,
                "delivered" => DeliveryStatus.Delivered,
                "failed" => DeliveryStatus.Failed,
                _ => null
            };

            if (newStatus == null)
            {
                return BadRequest(new { message = "Invalid status" });
            }

            if (existingDelivery.Status == DeliveryStatus.Delivered && newStatus.Value != DeliveryStatus.Delivered)
            {
                return BadRequest(new { message = "Delivered deliveries cannot be modified" });
            }

            if (existingDelivery.Status == DeliveryStatus.Delivered && newStatus.Value == DeliveryStatus.Delivered)
            {
                return Ok(new { message = "Delivery status updated successfully" });
            }

            // Basic consistency checks
            if ((newStatus == DeliveryStatus.Assigned || newStatus == DeliveryStatus.In_Transit || newStatus == DeliveryStatus.Delivered)
                && string.IsNullOrWhiteSpace(existingDelivery.DriverId))
            {
                return BadRequest(new { message = "Assign a driver before setting this status" });
            }

            existingDelivery.Status = newStatus.Value;
            existingDelivery.UpdatedDate = DateTime.UtcNow;

            // Keep order status in sync
            order.Status = newStatus.Value switch
            {
                DeliveryStatus.Pending => OrderStatus.ForDelivery,
                DeliveryStatus.Assigned => OrderStatus.Assigned,
                DeliveryStatus.In_Transit => OrderStatus.InTransit,
                DeliveryStatus.Delivered => OrderStatus.Delivered,
                DeliveryStatus.Failed => OrderStatus.ForDelivery,
                _ => order.Status
            };
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Delivery status updated successfully" });
        }

        [HttpPut("{deliveryId}/assign-driver")]
        public async Task<IActionResult> AssignDriver(int deliveryId, [FromBody] UpdateDeliveryDto dto)
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

            var existingDelivery = await _context.Deliveries
                .FirstOrDefaultAsync(d => d.Id == deliveryId);

            if (existingDelivery == null)
            {
                return NotFound(new { message = "Delivery not found" });
            }

            if (existingDelivery.Status == DeliveryStatus.Delivered)
            {
                return BadRequest(new { message = "Delivered deliveries cannot be modified" });
            }

            var driver = await _userManager.FindByIdAsync(dto.DriverId);
            if (driver == null)
            {
                return BadRequest(new { message = "Driver not found" });
            }

            // Assign driver
            existingDelivery.DriverId = dto.DriverId;  // make sure this is nullable if driver can be null
            existingDelivery.Status = DeliveryStatus.Assigned;
            existingDelivery.ScheduledDate = dto.ScheduledDate;
            existingDelivery.ScheduledTime = dto.ScheduledTime;
            existingDelivery.UpdatedDate = DateTime.UtcNow;

            if(dto.Notes !=  null)
            {
                existingDelivery.Notes = dto.Notes;
            }

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == existingDelivery.OrderId);
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            if (order.Status == OrderStatus.Delivered)
            {
                return BadRequest(new { message = "Delivered orders cannot be modified" });
            }

            order.Status = OrderStatus.Assigned;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Driver assigned successfully" });

        }

        [HttpPut("{deliveryId}/unassign-driver")]
        public async Task<IActionResult> UnassignDriver(int deliveryId)
        {
            var existingDelivery = await _context.Deliveries
                .FirstOrDefaultAsync(d => d.Id == deliveryId);

            if (existingDelivery == null)
            {
                return NotFound(new { message = "Delivery not found" });
            }

            if (existingDelivery.Status == DeliveryStatus.Delivered)
            {
                return BadRequest(new { message = "Delivered deliveries cannot be modified" });
            }

            if (string.IsNullOrWhiteSpace(existingDelivery.DriverId))
            {
                return BadRequest(new { message = "Delivery has no assigned driver" });
            }

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == existingDelivery.OrderId);
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            if (order.Status == OrderStatus.Delivered)
            {
                return BadRequest(new { message = "Delivered orders cannot be modified" });
            }

            existingDelivery.DriverId = null;
            existingDelivery.Status = DeliveryStatus.Pending;
            existingDelivery.ScheduledDate = null;
            existingDelivery.ScheduledTime = null;
            existingDelivery.UpdatedDate = DateTime.UtcNow;

            // Revert order back to "ForDelivery" (delivery exists but no driver assigned)
            order.Status = OrderStatus.ForDelivery;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Driver unassigned successfully" });
        }

    }
}
