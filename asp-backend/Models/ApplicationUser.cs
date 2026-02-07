using Microsoft.AspNetCore.Identity;

namespace asp_backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string ImagePath { get; set; } = "default.png";
    }
}