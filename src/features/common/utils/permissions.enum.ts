// src/common/enums/business-roles.enum.ts
export enum BusinessRoles {
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  STOCK = 'STOCK',
  WAITER = 'WAITER',
  // etc, los que uses en tu BD
}

export enum EmployeePermissions {
  CREATE_EMPLOYEE = "CREATE_EMPLOYEE",
  EDIT_EMPLOYEE = "EDIT_EMPLOYEE",
  DELETE_EMPLOYEE = "DELETE_EMPLOYEE",
}

// permissions/products.ts
export enum ProductPermissions {
  CREATE_PRODUCT = "CREATE_PRODUCT",
  EDIT_PRODUCT = "EDIT_PRODUCT",
  DELETE_PRODUCT = "DELETE_PRODUCT",
  MANAGE_PRODUCTS = "MANAGE_PRODUCTS", // ya lo tenías
}

// permissions/business.ts
export enum BusinessPermissions {
  CREATE_BUSINESS = "CREATE_BUSINESS",
  EDIT_BUSINESS = "EDIT_BUSINESS",
  DELETE_BUSINESS = "DELETE_BUSINESS",

  VIEW_DASHBOARD = "VIEW_DASHBOARD",
  CLOSE_CASH_REGISTER = "CLOSE_CASH_REGISTER",
  VIEW_REPORTS = "VIEW_REPORTS",
  MANAGE_DELIVERY_ZONES = "MANAGE_DELIVERY_ZONES",
}

// permissions/orders.ts
export enum OrderPermissions {
  VIEW_ORDERS = "VIEW_ORDERS",
  CREATE_ORDER = "CREATE_ORDER",
  EDIT_ORDER = "EDIT_ORDER",
  CANCEL_ORDER = "CANCEL_ORDER",
  PROCESS_ORDER = "PROCESS_ORDER",
  DELIVER_ORDER = "DELIVER_ORDER",
  COMPLETE_ORDER = "COMPLETE_ORDER",
}



// export enum PermissionsEnum {
//   // Permisos de gestión general del negocio
//   VIEW_DASHBOARD = 'VIEW_DASHBOARD',        // Permite ver el panel de control con métricas y resumen.
//   CLOSE_CASH_REGISTER = 'CLOSE_CASH_REGISTER', // Permite realizar el cierre de caja al final del día.
//   VIEW_REPORTS = 'VIEW_REPORTS',            // Permite acceder a informes financieros y de rendimiento.
//   MANAGE_PRODUCTS = 'MANAGE_PRODUCTS',      // Permite agregar, editar o eliminar productos y sus variantes.
  
//   // Permisos para el sistema de reservas (si aplica)
//   CREATE_RESERVATION = 'CREATE_RESERVATION', // Permite crear una nueva reserva de mesa o servicio.
//   EDIT_RESERVATION = 'EDIT_RESERVATION',    // Permite modificar una reserva existente.

//   // Permisos para el sistema de pedidos (como PedidoYa)
//   VIEW_ORDERS = 'VIEW_ORDERS',              // Permite ver la lista y el estado de los pedidos del negocio.
//   CREATE_ORDER = 'CREATE_ORDER',            // Permite generar un nuevo pedido manualmente.
//   EDIT_ORDER = 'EDIT_ORDER',                // Permite modificar un pedido en estado de "borrador" o "pendiente".
//   CANCEL_ORDER = 'CANCEL_ORDER',            // Permite anular un pedido en cualquier etapa.
//   PROCESS_ORDER = 'PROCESS_ORDER',          // Permite cambiar el estado de un pedido a "en preparación".
//   DELIVER_ORDER = 'DELIVER_ORDER',          // Permite asignar el pedido a un repartidor y marcarlo como "en camino".
//   COMPLETE_ORDER = 'COMPLETE_ORDER',        // Permite marcar un pedido como "entregado" o "finalizado".
  
//   // Permisos de configuración avanzada para el negocio
//   MANAGE_DELIVERY_ZONES = 'MANAGE_DELIVERY_ZONES', // Permite configurar y editar las zonas de entrega y sus tarifas.
// }

export const PermissionsEnum = {
  ...EmployeePermissions,
  ...ProductPermissions,
  ...BusinessPermissions,
  ...OrderPermissions,
} as const;

// Creamos un type seguro basado en los valores del objeto
export type PermissionsEnum = typeof PermissionsEnum[keyof typeof PermissionsEnum];