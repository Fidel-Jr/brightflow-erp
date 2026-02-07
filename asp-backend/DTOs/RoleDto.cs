using System.ComponentModel.DataAnnotations;

namespace asp_backend.DTOs
{
    public class RoleDto
    {
        [Required]
        public string Role { get; set; }
    }
}
