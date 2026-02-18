using asp_backend.Models;
using System.ComponentModel.DataAnnotations;

namespace asp_backend.DTOs
{
    public class ProductDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string SKU { get; set; } = string.Empty;
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public int LocationId { get; set; }
        public IFormFile? Image { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public int StockQuantity { get; set; }
        [Required]
        public int ReorderLevel { get; set; }
    }
}
