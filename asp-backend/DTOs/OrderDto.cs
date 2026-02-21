using System.ComponentModel.DataAnnotations;
using static asp_backend.Models.Enums.OrderStatusPrio;

namespace asp_backend.DTOs
{
    public class OrderDto
    {
        [Required]
        public string CustomerName { get; set; }
        [Required]
        [EmailAddress]
        public string CustomerEmail { get; set; }
        [Required]
        public string CustomerPhone { get; set; }
        [Required]
        public string CustomerAddress { get; set; }
        public OrderStatus Status { get; set; }
        public OrderPriorityLevel PriorityLevel { get; set; }
        [Required]
        public string? AssignedStaffId { get; set; }
        [Required]
        public DateOnly EstimatedDelivery { get; set; }
        public string? Notes { get; set; }
        [Required]
        public required List<OrderProductDto> Products { get; set; }
    }
}
