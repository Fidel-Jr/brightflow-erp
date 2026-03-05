using asp_backend.DTOs;
using asp_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace asp_backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

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

        private static string? FormatDateTime(DateTime? dateTime)
        {
            return dateTime?
                .ToLocalTime()
                .ToString("MM/dd/yyyy hh:mm:ss tt");
        }

        private static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, emailPattern);
        }

        private IActionResult ErrorResponse(string message)
        {
            return BadRequest(new { errors = message });
        }

        private IActionResult ErrorResponse(IEnumerable<string> messages)
        {
            return BadRequest(new { errors = string.Join(" ", messages) });
        }

        private IActionResult ErrorResponse(Dictionary<string, string> fieldErrors)
        {
            return BadRequest(new { errors = fieldErrors });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized(new { errors = "Invalid token or user not found." });

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound(new { errors = "User not found." });

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                id = user.Id,
                username = user.UserName,
                email = user.Email,
                roles = roles,
                lastLoginAt = FormatDateTime(user.LastLoginAt)
            });
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .OrderByDescending(u => u.LastLoginAt ?? DateTime.MinValue)
                .ToListAsync();

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
                    lastLoginAt = FormatDateTime(user.LastLoginAt)
                });
            }

            return Ok(userList);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateUser([FromBody] RegisterDto dto)
        {
            var fieldErrors = new Dictionary<string, string>();

            if (string.IsNullOrWhiteSpace(dto.Username))
                fieldErrors["username"] = "Username is required.";

            if (string.IsNullOrWhiteSpace(dto.Email))
                fieldErrors["email"] = "Email is required.";
            else if (!IsValidEmail(dto.Email))
                fieldErrors["email"] = "Email is not valid.";

            if (string.IsNullOrWhiteSpace(dto.Password))
                fieldErrors["password"] = "Password is required.";

            if (fieldErrors.Any())
                return ErrorResponse(fieldErrors);

            var existingUserByEmail = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUserByEmail != null)
            {
                return ErrorResponse(new Dictionary<string, string>
                {
                    ["email"] = "Email already exists."
                });
            }

            var existingUserByUsername = await _userManager.FindByNameAsync(dto.Username);
            if (existingUserByUsername != null)
            {
                return ErrorResponse(new Dictionary<string, string>
                {
                    ["username"] = "Username already exists."
                });
            }

            var user = new ApplicationUser
            {
                UserName = dto.Username,
                Email = dto.Email,
                Status = dto.Status
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                var identityErrors = new Dictionary<string, string>();
                foreach (var error in result.Errors)
                {
                    if (error.Code.Contains("Password"))
                        identityErrors["password"] = error.Description;
                    else if (error.Code.Contains("Email"))
                        identityErrors["email"] = error.Description;
                    else if (error.Code.Contains("UserName"))
                        identityErrors["username"] = error.Description;
                    else
                        identityErrors["general"] = error.Description;
                }
                return ErrorResponse(identityErrors);
            }

            foreach (var roleName in dto.Roles!)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    var role = new ApplicationRole
                    {
                        Name = roleName,
                        NormalizedName = roleName.ToUpper()
                    };

                    await _roleManager.CreateAsync(role);
                }

                await _userManager.AddToRoleAsync(user, roleName);
            }

            var assignedRoles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                isSuccess = true,
                message = "User created successfully",
                data = new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    Roles = assignedRoles,
                    user.Status
                }
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { errors = "User not found." });

            var fieldErrors = new Dictionary<string, string>();

            if (!string.IsNullOrWhiteSpace(dto.Username) && dto.Username != user.UserName)
            {
                var existingUser = await _userManager.FindByNameAsync(dto.Username);
                if (existingUser != null && existingUser.Id != user.Id)
                    fieldErrors["username"] = "Username already exists.";
            }

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                if (!IsValidEmail(dto.Email))
                {
                    fieldErrors["email"] = "Email is not valid.";
                }
                else if (dto.Email != user.Email)
                {
                    var existingUser = await _userManager.FindByEmailAsync(dto.Email);
                    if (existingUser != null && existingUser.Id != user.Id)
                        fieldErrors["email"] = "Email already exists.";
                }
            }

            if (fieldErrors.Any())
                return ErrorResponse(fieldErrors);

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
            {
                var identityErrors = new Dictionary<string, string>();
                foreach (var error in result.Errors)
                {
                    if (error.Code.Contains("Email"))
                        identityErrors["email"] = error.Description;
                    else if (error.Code.Contains("UserName"))
                        identityErrors["username"] = error.Description;
                    else
                        identityErrors["general"] = error.Description;
                }
                return ErrorResponse(identityErrors);
            }

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, token, dto.Password);
                if (!passwordResult.Succeeded)
                {
                    var passwordErrors = new Dictionary<string, string>
                    {
                        ["password"] = string.Join(" ", passwordResult.Errors.Select(e => e.Description))
                    };
                    return ErrorResponse(passwordErrors);
                }
            }

            if (dto.Roles != null && dto.Roles.Length > 0)
            {
                var existingRolesInDb = _roleManager.Roles.Select(r => r.Name).ToHashSet();

                var invalidRoles = dto.Roles.Where(r => !existingRolesInDb.Contains(r)).ToList();
                if (invalidRoles.Any())
                {
                    return ErrorResponse(new Dictionary<string, string>
                    {
                        ["roles"] = $"Role(s) do not exist: {string.Join(", ", invalidRoles)}"
                    });
                }

                var currentRoles = await _userManager.GetRolesAsync(user);

                var rolesToRemove = currentRoles.Except(dto.Roles).ToList();
                if (rolesToRemove.Any())
                    await _userManager.RemoveFromRolesAsync(user, rolesToRemove);

                var rolesToAdd = dto.Roles.Except(currentRoles).ToList();
                if (rolesToAdd.Any())
                    await _userManager.AddToRolesAsync(user, rolesToAdd);
            }

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

        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { errors = "User not found." });

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return ErrorResponse(result.Errors.Select(e => e.Description));
            }

            return Ok(new
            {
                isSuccess = true,
                message = "User deleted successfully"
            });
        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpGet("staffs")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetStaffs()
        {
            var warehouseStaff = await _userManager.GetUsersInRoleAsync(Roles.WarehouseStaff);
            var deliveryStaff = await _userManager.GetUsersInRoleAsync(Roles.DeliveryStaff);

            var staffs = warehouseStaff
                .Union(deliveryStaff)
                .DistinctBy(u => u.Id)
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