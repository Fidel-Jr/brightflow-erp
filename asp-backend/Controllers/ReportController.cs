using asp_backend.Data;
using asp_backend.DTOs;
using asp_backend.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace asp_backend.Controllers
{
    [Route("api/reports")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportController(AppDbContext context)
        {
            _context = context;
        }

        private decimal CalculatePercentageChange(decimal current, decimal previous)
        {
            if (previous == 0)
                return current > 0 ? 100 : 0;

            return Math.Round(((current - previous) / previous) * 100, 2);
        }

        private decimal CalculatePercentageChange(int current, int previous)
        {
            if (previous == 0)
                return current > 0 ? 100 : 0;

            return Math.Round(((decimal)(current - previous) / previous) * 100, 2);
        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpGet("dashboard-summary")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var now = DateTime.UtcNow;

            var startOfCurrentMonth = DateTime.SpecifyKind(
                new DateTime(now.Year, now.Month, 1),
                DateTimeKind.Utc
            );
            var startOfPreviousMonth = startOfCurrentMonth.AddMonths(-1);

            var currentOrders = await _context.Orders
                .Where(o => o.CreatedAt >= startOfCurrentMonth)
                .CountAsync();

            var previousOrders = await _context.Orders
                .Where(o => o.CreatedAt >= startOfPreviousMonth &&
                            o.CreatedAt < startOfCurrentMonth)
                .CountAsync();

            var ordersChange = CalculatePercentageChange(currentOrders, previousOrders);

            var totalLowStock = await _context.Products
                .Where(p => p.StockQuantity < p.ReorderLevel)
                .CountAsync();

            var totalPendingDeliveries = await _context.Deliveries
                .Where(d => d.Status == DeliveryStatus.Pending)
                .CountAsync();

            var currentRevenue = await _context.Deliveries
                .Where(d => d.Status == DeliveryStatus.Delivered &&
                            d.UpdatedDate >= startOfCurrentMonth)
                .Select(d => d.Order.TotalAmount)
                .SumAsync(o => (decimal?)o) ?? 0;

            var previousRevenue = await _context.Deliveries
                .Where(d => d.Status == DeliveryStatus.Delivered &&
                            d.UpdatedDate >= startOfPreviousMonth &&
                            d.UpdatedDate < startOfCurrentMonth)
                .Select(d => d.Order.TotalAmount)
                .SumAsync(o => (decimal?)o) ?? 0;

            var revenueChange = CalculatePercentageChange(currentRevenue, previousRevenue);

            var recentOrders = await _context.Orders
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .OrderByDescending(o => o.CreatedAt)
                .Take(5)
                .Select(o => new
                {
                    id = o.Id,
                    orderNumber = o.OrderNumber,
                    customerName = o.CustomerName,
                    productCount = o.OrderProducts.Count(),
                    firstProductName = o.OrderProducts
                        .Select(op => op.Product.Name)
                        .FirstOrDefault(),
                    totalAmount = o.TotalAmount,
                    status = o.Status.ToString(),
                    createdAt = o.CreatedAt.ToString("yyyy-MM-dd")
                })
                .ToListAsync();

            var salesByCategory = await _context.OrderProducts
                .Where(op =>
                    op.Order.Delivery != null &&
                    op.Order.Delivery.Status == DeliveryStatus.Delivered &&
                    op.Order.Delivery.UpdatedDate >= startOfCurrentMonth
                )
                .GroupBy(op => new
                {
                    op.Product.Category.Id,
                    op.Product.Category.Name
                })
                .Select(g => new
                {
                    categoryId = g.Key.Id,
                    categoryName = g.Key.Name,
                    totalSales = g.Sum(op => op.Quantity * op.Product.Price)
                })
                .OrderByDescending(x => x.totalSales)
                .Take(5)
                .ToListAsync();

            var topProducts = await _context.OrderProducts
                .Where(op =>
                    op.Order.Delivery != null &&
                    op.Order.Delivery.Status == DeliveryStatus.Delivered &&
                    op.Order.Delivery.UpdatedDate >= startOfCurrentMonth
                )
                .GroupBy(op => new
                {
                    op.Product.Id,
                    op.Product.Name
                })
                .Select(g => new
                {
                    productId = g.Key.Id,
                    productName = g.Key.Name,
                    totalQuantity = g.Sum(op => op.Quantity),
                    totalRevenue = g.Sum(op => op.Quantity * op.Product.Price)
                })
                .OrderByDescending(x => x.totalRevenue)
                .Take(5)
                .ToListAsync();

            return Ok(new
            {
                totalOrders = currentOrders,
                ordersChange,
                totalLowStock,
                totalPendingDeliveries,
                totalRevenue = currentRevenue,
                revenueChange,
                salesByCategory,
                recentOrders,
                topProducts
            });
        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpPost("monthly-revenue")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMonthlyRevenue(MonthlyRevenueDto request)
        {
            int months = request.Months;
            DateTime endDate = DateTime.UtcNow;
            DateTime startDate = endDate.AddMonths(-months);

            var query = _context.Deliveries
                .Include(d => d.Order)
                .Where(d => d.Status == DeliveryStatus.Delivered &&
                            d.UpdatedDate >= startDate &&
                            d.UpdatedDate <= endDate);

            var revenueByMonth = await query
                .GroupBy(d => new { d.UpdatedDate.Year, d.UpdatedDate.Month })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Revenue = g.Sum(d => d.Order.TotalAmount)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();

            for (int i = 0; i < months; i++)
            {
                var date = startDate.AddMonths(i);
                if (!revenueByMonth.Any(r => r.Year == date.Year && r.Month == date.Month))
                {
                    revenueByMonth.Add(new { Year = date.Year, Month = date.Month, Revenue = 0m });
                }
            }

            revenueByMonth = revenueByMonth.OrderBy(r => r.Year).ThenBy(r => r.Month).ToList();

            return Ok(revenueByMonth.Select(r => new
            {
                label = $"{r.Month}/{r.Year}",
                value = r.Revenue
            }));
        }
    }
}