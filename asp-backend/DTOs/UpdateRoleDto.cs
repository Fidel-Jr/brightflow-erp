using System.ComponentModel.DataAnnotations;

namespace asp_backend.DTOs
{
    public class UpdateRoleDto
    {
        [Required]
        public string Role { get; set; }
        public string Description { get; set; }
    }
}
