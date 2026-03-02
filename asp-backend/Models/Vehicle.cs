namespace asp_backend.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string VehicleName { get; set; }
        public string VehicleNumber { get; set; }
        public string VehicleType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
