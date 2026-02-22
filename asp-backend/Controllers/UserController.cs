using asp_backend.DTOs;
using asp_backend.Extensions;
using asp_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace asp_backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public static RoleManager<ApplicationRole> _roleManager;

        public UserController(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public static class Roles
        {
            public const string WarehouseStaff = "Warehouse Staff";
            public const string DeliveryStaff = "Delivery Staff";
        }

        // GET: api/users/me
        [HttpGet("me")]
        [Authorize]  // JWT authentication required
        public async Task<IActionResult> GetCurrentUser()
        {
            // Get the user ID from claims
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized(new { message = "Invalid token or user not found." });

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound(new { message = "User not found." });

            // Optionally include roles
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                id = user.Id,
                username = user.UserName,
                email = user.Email,
                roles = roles,
                lastLoginAt = user.LastLoginAt?
                                .ToLocalTime()
                                .ToString("MM/dd/yyyy hh:mm:ss tt")
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = _userManager.Users
                .OrderByDescending(u => u.LastLoginAt ?? DateTime.MinValue) // most recent login first
                .ToList();

            var userList = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userList.Add(new
                {
                    id = user.Id,
                    username = user.UserName,
                    email = user.Email,
                    fullName = user.FullName,
                    phoneNumber = user.PhoneNumber,
                    status = user.Status.ToString(),
                    roles = roles,
                    lastLoginAt = user.LastLoginAt?
                                    .ToLocalTime()
                                    .ToString("MM/dd/yyyy hh:mm:ss tt")
                });
            }

            return Ok(userList);
        }


        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> CreateUser([FromBody] RegisterDto dto)
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

            // Check existing user
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new
                {
                    isSuccess = false,
                    errors = new[] { "Email already exists." }
                });

            var user = new ApplicationUser
            {
                UserName = dto.Username,
                Email = dto.Email,
                Status = dto.Status
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(new { isSuccess = false, errors = result.Errors.Select(e => e.Description) });

            // Assign multiple roles dynamically
            foreach (var roleName in dto.Roles!)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    var role = new ApplicationRole
                    {
                        Name = roleName,
                        NormalizedName = roleName.ToUpper() // Important for Identity
                    };

                    await _roleManager.CreateAsync(role);
                }

                await _userManager.AddToRoleAsync(user, roleName);
            }

            return Ok(new
            {
                isSuccess = true,
                message = "User created successfully",
                data = new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    Roles = dto.Roles, // return the role names as-is
                    user.Status
                }
            });
        }

        [HttpPut("{id}")]
        //[Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            user.UserName = dto.Username ?? user.UserName;
            user.Email = dto.Email ?? user.Email;
            user.FullName = dto.FullName ?? user.FullName;
            user.PhoneNumber = dto.PhoneNumber ?? user.PhoneNumber;
            if (dto.Status.HasValue)
            {
                user.Status = dto.Status.Value;
            }
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(new
                {
                    isSuccess = false,
                    errors = result.Errors.Select(e => e.Description)
                });
            // Update password if provided
            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, token, dto.Password);
                if (!passwordResult.Succeeded)
                    return BadRequest(new
                    {
                        isSuccess = false,
                        errors = passwordResult.Errors.Select(e => e.Description)
                    });
            }

            // Handle roles if provided
            if (dto.Roles != null && dto.Roles.Length > 0)
            {
                // Get all existing roles in DB
                var existingRolesInDb = _roleManager.Roles.Select(r => r.Name).ToHashSet();

                // Check if any of the new roles do not exist in DB
                var invalidRoles = dto.Roles.Where(r => !existingRolesInDb.Contains(r)).ToList();
                if (invalidRoles.Any())
                {
                    return BadRequest(new
                    {
                        isSuccess = false,
                        errors = invalidRoles.Select(r => $"Role '{r}' does not exist in the system.")
                    });
                }
                
                // Remove roles not in new selection
                var currentRoles = await _userManager.GetRolesAsync(user);

                // Only remove roles that are being changed
                var rolesToRemove = currentRoles.Except(dto.Roles).ToList();
                if (rolesToRemove.Any())
                    await _userManager.RemoveFromRolesAsync(user, rolesToRemove);

                // Add roles that are new
                var rolesToAdd = dto.Roles.Except(currentRoles).ToList();
                if (rolesToAdd.Any())
                    await _userManager.AddToRolesAsync(user, rolesToAdd);
            }

            // Return updated roles
            var updatedRoles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                isSuccess = true,
                message = "User updated successfully",
                data = new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.FullName,
                    user.PhoneNumber,
                    Roles = updatedRoles,
                    user.Status
                }
            });

        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found." });
            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(new
                {
                    isSuccess = false,
                    errors = result.Errors.Select(e => e.Description)
                });
            return Ok(new
            {
                isSuccess = true,
                message = "User deleted successfully"
            });
        }

        [HttpGet("staffs")]
        public async Task<IActionResult> GetStaffs()
        {
            var warehouseStaff = await _userManager.GetUsersInRoleAsync(Roles.WarehouseStaff);
            var deliveryStaff = await _userManager.GetUsersInRoleAsync(Roles.DeliveryStaff);

            var staffs = warehouseStaff
                .Union(deliveryStaff)
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.FullName,
                    u.Email
                });

            return Ok(staffs);
        }

    }
}
