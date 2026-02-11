// auth-roles.ts
export const hasRole = (user, role) =>
  user?.roles?.includes(role);

export const isAdmin = (user) =>
  hasRole(user, "Admin");

export const isManager = (user) =>
  hasRole(user, "Manager");