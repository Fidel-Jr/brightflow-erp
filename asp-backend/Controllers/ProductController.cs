using asp_backend.Data;
using asp_backend.DTOs;
using asp_backend.Models;
using asp_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace asp_backend.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UploadImageService _uploadImageService;

        public ProductController(AppDbContext context, UploadImageService uploadImageService)
        {
            _context = context;
            _uploadImageService = uploadImageService;
        }

        //[Authorize(Policy = "AdminOnly")]
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.SKU,
                    Category = new
                    {
                        p.Category.Id,
                        p.Category.Name
                    },
                    Location = new
                    {
                        p.Location.Id,
                        p.Location.Name
                    },
                    ImageUrl = string.IsNullOrEmpty(p.ImageUrl)
                                ? "/uploads/default-image.jpg"
                                : p.ImageUrl,
                    p.Price,
                    p.StockQuantity,
                    p.ReorderLevel,
                    p.Status
                })
                .ToListAsync(); // ✅ return ALL

            return Ok(products);
        }

        //[HttpGet]
        //public async Task<IActionResult> GetProducts(int pageNumber = 1, int pageSize = 5)
        //{
        //    // Basic validation
        //    pageNumber = pageNumber < 1 ? 1 : pageNumber;
        //    pageSize = pageSize > 5 ? 5 : pageSize;

        //    // 1. Get the total count before slicing the data
        //    var totalRecords = await _context.Products.CountAsync();

        //    // 2. Fetch only the specific "page" of data
        //    var products = await _context.Products
        //        .OrderBy(p => p.Id) // Required for consistent Skip/Take
        //        .Skip((pageNumber - 1) * pageSize)
        //        .Take(pageSize)
        //        .Select(p => new
        //        {
        //            p.Id,
        //            p.Name,
        //            p.Description,
        //            p.SKU,
        //            Category = new { p.Category.Id, p.Category.Name },
        //            Location = new { p.Location.Id, p.Location.Name },
        //            ImageUrl = string.IsNullOrEmpty(p.ImageUrl)
        //                        ? "/uploads/default-image.jpg"
        //                        : p.ImageUrl,
        //            p.Price,
        //            p.StockQuantity,
        //            p.Status
        //        })
        //        .ToListAsync();

        //    // 3. Calculate total pages
        //    var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

        //    return Ok(new
        //    {
        //        TotalRecords = totalRecords,
        //        TotalPages = totalPages,
        //        CurrentPage = pageNumber,
        //        PageSize = pageSize,
        //        Data = products
        //    });
        //}


        //[Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed",
                    errors = ModelState
                        .Where(x => x.Value!.Errors.Count > 0)
                        .ToDictionary(
                            k => k.Key,
                            v => v.Value!.Errors.Select(e => e.ErrorMessage)
                        )
                });
            }

            // 🔥 Business validation
            if (await _context.Products.AnyAsync(p => p.SKU == productDto.SKU))
                return Conflict(new { message = "SKU already exists." });

            if (!await _context.Categories.AnyAsync(c => c.Id == productDto.CategoryId))
                return BadRequest(new { message = "Invalid category." });

            if (!await _context.Locations.AnyAsync(l => l.Id == productDto.LocationId))
                return BadRequest(new { message = "Invalid location." });

            // 🔥 Image handling
            string imageUrl = "/uploads/default-image.jpg";

            if (productDto.Image != null)
            {
                imageUrl = await _uploadImageService
                    .UploadImageAsync(productDto.Image, "uploads");
            }

            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                SKU = productDto.SKU,
                CategoryId = productDto.CategoryId,
                LocationId = productDto.LocationId,
                ImageUrl = imageUrl, // ✅ use uploaded image
                Price = productDto.Price,
                StockQuantity = productDto.StockQuantity,
                ReorderLevel = productDto.ReorderLevel,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // 🔥 Return clean projection
            var response = await _context.Products
                .Where(p => p.Id == product.Id)
                .Select(p => new
                {
                    p.Name,
                    p.Description,
                    p.SKU,
                    Category = p.Category.Name,
                    Location = p.Location.Name,
                    p.ImageUrl,
                    p.Price,
                    p.StockQuantity,
                    p.ReorderLevel,
                    p.Status
                })
                .FirstOrDefaultAsync();

            return Ok(new
            {
                message = "Product created successfully",
                data = response
            });
        }


        //[Authorize(Policy = "AdminOnly")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed",
                    errors = ModelState
                        .Where(x => x.Value!.Errors.Count > 0)
                        .ToDictionary(
                            k => k.Key,
                            v => v.Value!.Errors.Select(e => e.ErrorMessage)
                        )
                });
            }

            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound(new { message = "Product not found." });

            // 🔥 SKU uniqueness (exclude current product)
            if (await _context.Products
                .AnyAsync(p => p.SKU == productDto.SKU && p.Id != id))
            {
                return Conflict(new { message = "SKU already exists." });
            }

            // 🔥 FK validation
            if (!await _context.Categories.AnyAsync(c => c.Id == productDto.CategoryId))
                return BadRequest(new { message = "Invalid category." });

            if (!await _context.Locations.AnyAsync(l => l.Id == productDto.LocationId))
                return BadRequest(new { message = "Invalid location." });

            // 🔥 Image replacement logic
            if (productDto.Image != null)
            {
                // delete old image if not default
                if (!string.IsNullOrEmpty(product.ImageUrl) &&
                    product.ImageUrl != "/default-image.jpg")
                {
                    _uploadImageService.DeleteImage(product.ImageUrl);
                }

                product.ImageUrl = await _uploadImageService
                    .UploadImageAsync(productDto.Image, "uploads");
            }

            // 🔥 Update fields
            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.SKU = productDto.SKU;
            product.CategoryId = productDto.CategoryId;
            product.LocationId = productDto.LocationId;
            product.Price = productDto.Price;
            product.StockQuantity = productDto.StockQuantity;
            product.ReorderLevel = productDto.ReorderLevel;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var response = await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.SKU,
                    Category = p.Category.Name,
                    Location = p.Location.Name,
                    p.ImageUrl,
                    p.Price,
                    p.StockQuantity,
                    p.ReorderLevel,
                    p.Status,
                    p.UpdatedAt
                })
                .FirstOrDefaultAsync();

            return Ok(new
            {
                message = "Product updated successfully",
                data = response
            });
        }


        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Product deleted successfully" });
        }
    }
}
