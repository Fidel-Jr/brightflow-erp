using asp_backend.Data;
using asp_backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace asp_backend.Controllers
{
    [Route("api/locations")]
    [ApiController]
    public class LocationController : ControllerBase
    {

        private readonly AppDbContext _context;

        public LocationController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet]
        public async Task<IActionResult> GetLocations()
        {
            var categories = await _context.Locations
                .Select(c => new
                {
                    c.Id,
                    c.Name
                })
                .ToListAsync();

            return Ok(categories);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<IActionResult> CreateLocation([FromBody] LocationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Location name cannot be empty.");
            var existingLocation = await _context.Locations
                .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Name.ToLower());
            if (existingLocation != null)
                return Conflict("A location with the same name already exists.");
            var newLocation = new Models.Location
            {
                Name = dto.Name.Trim(),
            };
            _context.Locations.Add(newLocation);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetLocations), new { id = newLocation.Id }, new { newLocation.Id, newLocation.Name });

        }
    }
}
