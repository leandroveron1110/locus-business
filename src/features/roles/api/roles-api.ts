import axios from "@/lib/api"
import { BusinessRole, CreateBusinessRole } from "../types/roles";


export const createRoleApi = async (data: CreateBusinessRole): Promise<BusinessRole> =>{ 
   const res = await axios.post<BusinessRole>('/roles', data);

   return res.data
}

export const getRoleApi = async (roleId: string) => {
    const rest = await axios.get(`/roles/${roleId}`);
    return rest.data
}

export const getRolesByBusinessIdApi = async (businessId: string): Promise<BusinessRole[]> => {
    const rest = await axios.get<BusinessRole[]>(`/roles/business/${businessId}`);
    return rest.data
}


export const updateRoleApi = async ({ roleId, data }: {roleId: string, data: Partial<CreateBusinessRole>}) => {
    await axios.patch(`/roles/${roleId}`, data);
}