namespace asp_backend.Models.Enums
{
    public class OrderStatusPrio
    {
        public enum OrderStatus
        {
            Pending,
            Processing,
            Shipped,
            Delivered
        }

        public enum OrderPriorityLevel
        {
            Low,
            Medium,
            High
        }
    }
}
