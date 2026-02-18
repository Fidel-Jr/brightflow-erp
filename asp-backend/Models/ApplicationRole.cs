using Microsoft.AspNetCore.Identity;

namespace asp_backend.Models
{
    public class ApplicationRole : IdentityRole
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
