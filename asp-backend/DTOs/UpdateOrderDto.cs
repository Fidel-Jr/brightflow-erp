using asp_backend.Models.Enums;
using static asp_backend.Models.Enums.OrderStatusPrio;
using System.ComponentModel.DataAnnotations;

namespace asp_backend.DTOs
{
    public class UpdateOrderDto
    {
        [Required]
        public required string CustomerName { get; set; }

        [Required]
        [EmailAddress]
        public required string CustomerEmail { get; set; }

        [Required]
        public required string CustomerPhone { get; set; }

        [Required]
        public required string CustomerAddress { get; set; }

        public double? CustomerLat { get; set; }
        public double? CustomerLng { get; set; }
        public OrderStatus Status { get; set; }
        public OrderPriorityLevel PriorityLevel { get; set; }
        public string? AssignedStaffId { get; set; }
        public DateOnly? EstimatedDelivery { get; set; }
        public string? Notes { get; set; }
        public List<UpdateOrderProductDto>? Products { get; set; }
    }
}
