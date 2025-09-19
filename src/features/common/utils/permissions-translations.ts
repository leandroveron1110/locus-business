
import { PermissionsEnum } from "./permissions.enum";

export const PermissionLabels: Record<PermissionsEnum, string> = {
  // EmployeePermissions
  [PermissionsEnum.CREATE_EMPLOYEE]: "Crear empleado",
  [PermissionsEnum.EDIT_EMPLOYEE]: "Editar empleado",
  [PermissionsEnum.DELETE_EMPLOYEE]: "Eliminar empleado",

  // ProductPermissions
  [PermissionsEnum.CREATE_PRODUCT]: "Crear producto",
  [PermissionsEnum.EDIT_PRODUCT]: "Editar producto",
  [PermissionsEnum.DELETE_PRODUCT]: "Eliminar producto",
  [PermissionsEnum.MANAGE_PRODUCTS]: "Gestionar productos",

  // BusinessPermissions
  [PermissionsEnum.CREATE_BUSINESS]: "Crear negocio",
  [PermissionsEnum.EDIT_BUSINESS]: "Editar negocio",
  [PermissionsEnum.DELETE_BUSINESS]: "Eliminar negocio",
  [PermissionsEnum.VIEW_DASHBOARD]: "Ver dashboard",
  [PermissionsEnum.CLOSE_CASH_REGISTER]: "Cerrar caja",
  [PermissionsEnum.VIEW_REPORTS]: "Ver reportes",
  [PermissionsEnum.MANAGE_DELIVERY_ZONES]: "Gestionar zonas de entrega",

  // OrderPermissions
  [PermissionsEnum.VIEW_ORDERS]: "Ver pedidos",
  [PermissionsEnum.CREATE_ORDER]: "Crear pedido",
  [PermissionsEnum.EDIT_ORDER]: "Editar pedido",
  [PermissionsEnum.CANCEL_ORDER]: "Cancelar pedido",
  [PermissionsEnum.PROCESS_ORDER]: "Procesar pedido",
  [PermissionsEnum.DELIVER_ORDER]: "Marcar como enviado",
  [PermissionsEnum.COMPLETE_ORDER]: "Marcar como entregado",
};
