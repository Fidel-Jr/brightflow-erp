using System.ComponentModel.DataAnnotations;

namespace asp_backend.Models.Enums
{
    public enum DeliveryStatus
    {
        Pending,
        Assigned,
        [Display(Name = "In Transit")]
        In_Transit,
        Delivered,
        Failed
    }
}