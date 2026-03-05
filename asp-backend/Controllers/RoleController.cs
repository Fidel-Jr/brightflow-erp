using asp_backend.DTOs;
using asp_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace asp_backend.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public RoleController(RoleManager<ApplicationRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRoles()
        {
            var roles = _roleManager.Roles.ToList();

            var rolesWithUserCount = new List<object>();

            foreach (var role in roles)
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name!);

                rolesWithUserCount.Add(new
                {
                    id = role.Id,
                    name = role.Name,
                    description = role.Description ?? "",
                    userCount = usersInRole.Count
                });
            }

            return Ok(rolesWithUserCount);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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

        [Authorize(Policy = "AdminOnly")]
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateRole(string id, [FromBody] UpdateRoleDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Description))
                return BadRequest(new { message = "Role description cannot be empty." });

            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
                return NotFound(new { message = "Role not found." });

            role.Description = dto.Description;
            role.Name = dto.Role;

            var result = await _roleManager.UpdateAsync(role);

            if (!result.Succeeded)
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "Error updating role.",
                        errors = result.Errors.Select(e => e.Description)
                    }
                );

            return Ok(new
            {
                message = "Role updated successfully.",
                role = new
                {
                    id = role.Id,
                    name = role.Name,
                    description = role.Description
                }
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
                return NotFound(new { message = "Role not found." });

            var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name!);
            if (usersInRole.Any())
                return BadRequest(new { message = "Cannot delete role with assigned users." });

            var result = await _roleManager.DeleteAsync(role);
            if (!result.Succeeded)
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "Error deleting role.",
                        errors = result.Errors.Select(e => e.Description)
                    }
                );

            return Ok(new { message = "Role deleted successfully." });
        }
    }
}