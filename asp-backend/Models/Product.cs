using System.ComponentModel.DataAnnotations;

namespace asp_backend.Models
{
    public class Product
    {
        public enum ProductStatus
        {
            [Display(Name = "In Stock")]
            In_Stock,

            [Display(Name = "Low Stock")]
            Low_Stock,

            [Display(Name = "Out of Stock")]
            Out_of_Stock
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string SKU { get; set; } = string.Empty;
        // Foreign key for Category
        public int CategoryId { get; set; }
        // Navigation property for related Category
        public Category Category { get; set; }
        public int LocationId { get; set; }
        public Location Location { get; set; }
        public string ImageUrl { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public int ReorderLevel { get; set; }
        public ProductStatus Status { get; set; } = ProductStatus.In_Stock;
        public DateTime? LastRestocked { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
