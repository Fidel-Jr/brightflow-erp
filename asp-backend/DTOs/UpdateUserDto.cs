using asp_backend.Models.Enums;

namespace asp_backend.DTOs
{
    public class UpdateUserDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Password { get; set; }
        public string[]? Roles { get; set; }
        // Admin-only
        public UserStatus? Status { get; set; }
    }
}