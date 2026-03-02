namespace asp_backend.Models.Enums
{
    public class OrderStatusPrio
    {
        public enum OrderStatus
        {
            Pending,
            Processing,
            ForDelivery,
            Assigned,
            InTransit,
            Delivered,
            Failed
        }

        public enum OrderPriorityLevel
        {
            Low,
            Medium,
            High
        }
    }
}
