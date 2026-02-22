using asp_backend.DTOs;
using asp_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace asp_backend.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        public static RoleManager<ApplicationRole> _roleManager;
        public static UserManager<ApplicationUser> _userManager;

        public RoleController(RoleManager<ApplicationRole> roleManager, UserManager<ApplicationUser> userManager)
        { 
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetRoles()
        {
            // Get all roles
            var roles = _roleManager.Roles.ToList();

            // Build a response with role name + assigned user count
            var rolesWithUserCount = new List<object>();

            foreach (var role in roles)
            {
                // Get all users in this role
                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name!);

                rolesWithUserCount.Add(new
                {
                    name = role.Name,
                    userCount = usersInRole.Count
                });
            }

            return Ok(rolesWithUserCount);
        }



        [HttpPost]
        //[Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> CreateRole([FromBody] RoleDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Role))
            {
                return BadRequest(new { message = "Role name cannot be empty." });
            }

            if (string.IsNullOrWhiteSpace(dto.Description))
            {
                return BadRequest(new { message = "Role Description cannot be empty." });
            }

            var roleExists = await _roleManager.RoleExistsAsync(dto.Role);

            if (roleExists)
            {
                return Conflict(new { message = "Role already exists." });
            }

            var role = new ApplicationRole
            {
                Name = dto.Role,
                NormalizedName = dto.Role.ToUpper(),
                Description = dto.Description
            };

            var result = await _roleManager.CreateAsync(role);

            if (!result.Succeeded)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "Error creating role.",
                        errors = result.Errors.Select(e => e.Description)
                    }
                );
            }

            return Ok(new
            {
                message = "Role created successfully.",
                role = dto.Role
            });
        }

    }
}
