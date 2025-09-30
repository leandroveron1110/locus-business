// src/features/common/utils/permissions-groups.ts
import { PermissionsEnum } from "./permissions.enum";

export const PermissionGroups = {
  EMPLOYEES: {
    label: "Gestión de empleados",
    permissions: [
      PermissionsEnum.CREATE_EMPLOYEE,
      PermissionsEnum.EDIT_EMPLOYEE,
      PermissionsEnum.DELETE_EMPLOYEE,
    ],
  },
  PRODUCTS: {
    label: "Gestión de productos",
    permissions: [
      PermissionsEnum.CREATE_PRODUCT,
      PermissionsEnum.EDIT_PRODUCT,
      PermissionsEnum.DELETE_PRODUCT,
      PermissionsEnum.MANAGE_PRODUCTS,
    ],
  },
  BUSINESS: {
    label: "Gestión del negocio",
    permissions: [
      PermissionsEnum.CREATE_BUSINESS,
      PermissionsEnum.EDIT_BUSINESS,
      PermissionsEnum.DELETE_BUSINESS,
      PermissionsEnum.VIEW_DASHBOARD,
      PermissionsEnum.CLOSE_CASH_REGISTER,
      PermissionsEnum.VIEW_REPORTS,
      PermissionsEnum.MANAGE_DELIVERY_ZONES,
    ],
  },
  ORDERS: {
    label: "Gestión de pedidos",
    permissions: [
      PermissionsEnum.VIEW_ORDERS,
      PermissionsEnum.CREATE_ORDER,
      PermissionsEnum.EDIT_ORDER,
      PermissionsEnum.CANCEL_ORDER,
      PermissionsEnum.PROCESS_ORDER,
      PermissionsEnum.DELIVER_ORDER,
      PermissionsEnum.COMPLETE_ORDER,
    ],
  },
};
