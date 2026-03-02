export const normalizeOrderDetails = (dto) => ({
  id: dto.Id,
  orderNumber: dto.OrderNumber,
  customer: {
    name: dto.CustomerName,
    email: dto.CustomerEmail,
    phone: dto.CustomerPhone,
    address: dto.CustomerAddress,
    customerLat: dto.CustomerLat,
    customerLng: dto.CustomerLng,
    distanceKm: dto.DistanceKm,
    durationMinutes: dto.DurationMinutes,
  },
  products: (dto.OrderProducts ?? []).map((op) => ({
    productName: op.ProductName,
    // sku: op.Sku, // not provided by your DTO
    quantity: op.Quantity,
    price: op.Price,
  })),
  status: dto.Status,
  priorityLevel: dto.PriorityLevel,
  totalAmount: dto.TotalAmount,
  estimatedDelivery: dto.EstimatedDelivery,
  assignedStaffName: dto.AssignedStaffName,
  notes: dto.Notes,
});