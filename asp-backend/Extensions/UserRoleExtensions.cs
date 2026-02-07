using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace asp_backend.Extensions
{
    public static class UserRoleExtensions
    {
        public static string GetDisplayName(this Enum value)
        {
            var member = value
                .GetType()
                .GetMember(value.ToString())
                .FirstOrDefault();

            if (member == null)
                return value.ToString();

            return member
                .GetCustomAttribute<DisplayAttribute>()?
                .Name ?? value.ToString();
        }
    }
}
