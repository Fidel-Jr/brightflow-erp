using System.ComponentModel.DataAnnotations;

namespace asp_backend.DTOs
{
    public class UpdateDeliveryDto
    {
        [Required]
        public string DriverId { get; set; }
        [Required]
        public DateOnly ScheduledDate { get; set; }
        [Required]
        public TimeOnly ScheduledTime { get; set; }
        public string? Notes { get; set; }
    }
}
