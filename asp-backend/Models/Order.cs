using System.ComponentModel.DataAnnotations;
using static asp_backend.Models.Enums.OrderStatusPrio;

namespace asp_backend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerAddress { get; set; }
        public double CustomerLat { get; set; }
        public double CustomerLng { get; set; }
        public double DistanceKm { get; set; }
        public double DurationMinutes { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public OrderPriorityLevel PriorityLevel { get; set; } = OrderPriorityLevel.Low;
        public DateOnly EstimatedDelivery { get; set; }
        public string? AssignedStaffId { get; set; }
        public ApplicationUser? AssignedStaff { get; set; }
        public string Notes { get; set; }
        public ICollection<OrderProducts> OrderProducts { get; set; }
        public Decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
