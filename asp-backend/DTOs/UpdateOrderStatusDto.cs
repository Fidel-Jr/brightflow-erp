using static asp_backend.Models.Enums.OrderStatusPrio;


namespace asp_backend.DTOs
{
    public class UpdateOrderStatusDto
    {
        public OrderStatus Status { get; set; }
    }
}
