using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace asp_backend.Models
{
    public class ApplicationRole : IdentityRole
    {
        [Required]
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
