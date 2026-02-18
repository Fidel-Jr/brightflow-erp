using asp_backend.Models.Enums;
using Microsoft.AspNetCore.Identity;

namespace asp_backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        //public enum UserStatus
        //{
        //    Active,
        //    Inactive
        //}
        public string FullName { get; set; } = string.Empty;
        public string ImagePath { get; set; } = "default.png";
        public UserStatus? Status { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }
}