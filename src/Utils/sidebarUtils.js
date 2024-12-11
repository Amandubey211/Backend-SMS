// utils/sidebarUtils.js
export const filterSidebarData = (sidebarData, role, permissions) => {
  return sidebarData.filter((item) => {
    // Check if the item is accessible based on role
    if (!item.roles.includes(role)) return false;

    // Check if permissions are required and match
    if (
      item.requiredPermission &&
      !permissions.includes(item.requiredPermission)
    ) {
      return false;
    }

    return true;
  });
};
