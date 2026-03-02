using System.ComponentModel.DataAnnotations;

namespace asp_backend.DTOs
{
    public class UpdateDeliveryStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
