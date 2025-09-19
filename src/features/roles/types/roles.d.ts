import { PermissionsEnum } from "@/features/common/utils/permissions.enum";



export interface BusinessRole {
  id: string; // El ID que genera el servidor
  businessId: string;
  name: string;
  permissions: PermissionsEnum[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBusinessRole {
  businessId: string;
  name: string;
  permissions: PermissionsEnum[];
}
