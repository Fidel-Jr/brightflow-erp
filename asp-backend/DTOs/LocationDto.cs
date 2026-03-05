using System.ComponentModel.DataAnnotations;

namespace asp_backend.DTOs
{
    public class LocationDto
    {
        [Required]
        public string Name { get; set; }
    }
}
