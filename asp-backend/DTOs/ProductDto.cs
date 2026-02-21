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
        [Range(1, int.MaxValue, ErrorMessage = "Price must be at least 1.")]
        public decimal Price { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Stock quantity must be at least 1.")]
        public int StockQuantity { get; set; }
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Reorder level cannot be negative.")]
        public int ReorderLevel { get; set; }
    }
}
