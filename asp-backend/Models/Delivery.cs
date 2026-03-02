using asp_backend.Models.Enums;

namespace asp_backend.Models
{
    public class Delivery
    {
        public int Id { get; set; }
        public string DeliveryNumber { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public string? DriverId { get; set; }
        public ApplicationUser Driver { get; set; }
        public DateOnly? ScheduledDate { get; set; }
        public TimeOnly? ScheduledTime { get; set; }
        public DeliveryStatus Status { get; set; } = DeliveryStatus.Pending;
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
    }
}
