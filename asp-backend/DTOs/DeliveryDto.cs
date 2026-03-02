using System.ComponentModel.DataAnnotations;

namespace asp_backend.DTOs
{
    public class DeliveryDto
    {
        [Required]
        public int OrderId { get; set; }
        public string Notes { get; set; }
    }
}
