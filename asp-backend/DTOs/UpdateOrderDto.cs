using asp_backend.Models.Enums;
using static asp_backend.Models.Enums.Status;
using static asp_backend.Models.Enums.OrderStatusPrio;
using System.ComponentModel.DataAnnotations;

namespace asp_backend.DTOs
{
    public class UpdateOrderDto
    {
        public string CustomerName { get; set; }
        [EmailAddress]
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerAddress { get; set; }
        public OrderStatus Status { get; set; }
        public OrderPriorityLevel PriorityLevel { get; set; }
        public string? AssignedStaffId { get; set; }
        public DateOnly? EstimatedDelivery { get; set; }
        public string Notes { get; set; }
        public List<UpdateOrderProductDto>? Products { get; set; }
    }
}
