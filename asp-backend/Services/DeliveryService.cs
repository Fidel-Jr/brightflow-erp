using asp_backend.Data;
using Microsoft.EntityFrameworkCore;

namespace asp_backend.Services
{
    public class DeliveryService
    {
        private readonly AppDbContext _context;

        public DeliveryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<string> GenerateDeliveryNumberAsync()
        {
            var year = DateTime.Now.Year;

            var lastDelivery = await _context.Deliveries
                .Where(d => d.DeliveryNumber.StartsWith($"DEL-{year}-"))
                .OrderByDescending(d => d.Id)
                .FirstOrDefaultAsync();

            int nextNumber = 1;

            if (lastDelivery != null)
            {
                var parts = lastDelivery.DeliveryNumber.Split('-');
                if (parts.Length == 3 && int.TryParse(parts[2], out int lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            return $"DEL-{year}-{nextNumber:D3}";
        }
    }
}
