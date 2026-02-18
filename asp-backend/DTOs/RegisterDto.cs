using asp_backend.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace asp_backend.DTOs
{
    public enum UserRole
    {
        [Display(Name = "Admin")]
        Admin,

        [Display(Name = "Manager")]
        Manager,

        [Display(Name = "Warehouse Staff")]
        Warehouse_Staff,

        [Display(Name = "Delivery Staff")]
        Delivery_Staff
    }

    public class RegisterDto
    {
        [Required]
        public required string Username { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
        [Required]
        public string[]? Roles { get; set; }
        [Required]
        public UserStatus Status { get; set; } = UserStatus.Active;
    }
}
