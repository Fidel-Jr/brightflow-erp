using asp_backend.DTOs;
using asp_backend.Models;
using asp_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace asp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtService _jwtService;
        public static RoleManager<ApplicationRole> _roleManager;
        public AuthController(UserManager<ApplicationUser> userManager, JwtService jwtService, RoleManager<ApplicationRole> roleManager)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _roleManager = roleManager;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                return Unauthorized(
                    new { isSuccess = false, message = "Invalid credentials" }
                );
            }
            user.LastLoginAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtService.GenerateToken(user, roles);

            return Ok(new { isSuccess = true, user = user.UserName, token });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(dto.Username))
                errors.Add("Username is required.");

            if (string.IsNullOrWhiteSpace(dto.Email))
                errors.Add("Email is required.");

            if (string.IsNullOrWhiteSpace(dto.Password))
                errors.Add("Password is required.");

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
                if (!Regex.IsMatch(dto.Email, emailPattern))
                    errors.Add("Email is not valid.");
            }

            if (errors.Any())
                return BadRequest(new { isSuccess = false, errors });

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);

            if (existingUser != null)
                return BadRequest(new
                {
                    isSuccess = false,
                    errors = new[] { "Email already registered." }
                });

            var user = new ApplicationUser
            {
                UserName = dto.Username,
                Email = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(new
                {
                    isSuccess = false,
                    errors = result.Errors.Select(e => e.Description)
                });

            const string defaultRole = "WStaff"; // or Staff
            if (!await _roleManager.RoleExistsAsync(defaultRole))
            {
                var role = new ApplicationRole
                {
                    Name = defaultRole,
                    NormalizedName = defaultRole.ToUpper()
                };

                await _roleManager.CreateAsync(role);
            }

            await _userManager.AddToRoleAsync(user, defaultRole);

            return Ok(new
            {
                isSuccess = true,
                message = "User registered successfully"
            });
        }

    }
}
