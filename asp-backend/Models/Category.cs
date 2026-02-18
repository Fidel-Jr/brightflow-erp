namespace asp_backend.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        // Navigation property for related Products
        public ICollection<Product> Products { get; set; }
    }
}