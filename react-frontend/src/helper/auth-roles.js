// auth-roles.ts
export const hasRole = (user, role) => {
  const desired = (role ?? '').toString().trim().toLowerCase();
  if (!desired) return false;

  const roles = Array.isArray(user?.roles)
    ? user.roles
    : user?.role
      ? [user.role]
      : [];

  return roles
    .map((r) => (r ?? '').toString().trim().toLowerCase())
    .includes(desired);
};

export const isAdmin = (user) =>
  hasRole(user, "Admin");

export const isManager = (user) =>
  hasRole(user, "Manager");