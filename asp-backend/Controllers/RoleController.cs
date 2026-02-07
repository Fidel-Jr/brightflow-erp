using asp_backend.DTOs;
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
        public static RoleManager<IdentityRole> _roleManager;

        public RoleController(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public IActionResult GetRoles()
        {
            var roles = _roleManager.Roles
                .Select(r => r.Name)
                .ToList();

            return Ok(new { roles });
        }


        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> CreateRole([FromBody] RoleDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Role))
            {
                return BadRequest(new { message = "Role name cannot be empty." });
            }

            var roleExists = await _roleManager.RoleExistsAsync(dto.Role);

            if (roleExists)
            {
                return Conflict(new { message = "Role already exists." });
            }

            var result = await _roleManager.CreateAsync(
                new IdentityRole(dto.Role)
            );

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
