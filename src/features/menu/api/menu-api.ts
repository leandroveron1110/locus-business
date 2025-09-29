import { apiDelete, apiGet, apiPost, apiPut, ApiResult } from "@/lib/apiFetch";
import {
  IMenu,
  IMenuSectionWithProducts,
  IMenuProduct,
  IOptionGroup,
  IOption,
  MenuCreate,
  SectionCreate,
  MenuProductCreate,
  OptionGroupCreate,
  OptionCreate,
} from "../types/menu";
import { handleApiError } from "@/lib/handleApiError";


// MENUS
export const fetchMenuByBusinessId = async (
  businessId: string
): Promise<ApiResult<IMenu[]>> => {
  try {
    return await apiGet<IMenu[]>(`menus/business/${businessId}`);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudieron obtener los menús del negocio con ID ${businessId}.`);
  }
};

export const createMenu = async (newMenu: MenuCreate): Promise<ApiResult<IMenu>> => {
  try {
    return await apiPost<IMenu>(`menus/`, newMenu);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo crear el menú "${newMenu.name}".`);
  }
};

export const updateMenu = async (
  menuId: string,
  data: Partial<MenuCreate>
): Promise<ApiResult<IMenu>> => {
  try {
    return await apiPut<IMenu>(`menus/${menuId}`, data);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo actualizar el menú con ID ${menuId}.`);
  }
};

export const deleteMenu = async (menuId: string): Promise<void> => {
  try {
    await apiDelete(`menus/${menuId}`);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo eliminar el menú con ID ${menuId}.`);
  }
};

// SECTIONS
export const createSection = async (
  section: SectionCreate
): Promise<ApiResult<IMenuSectionWithProducts>> => {
  try {
    return await apiPost<IMenuSectionWithProducts>(`menus/sections`, section);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo crear la sección "${section.name}".`);
  }
};

export const updateSection = async (
  sectionId: string,
  data: Partial<SectionCreate>
): Promise<ApiResult<IMenuSectionWithProducts>> => {
  try {
    return await apiPut<IMenuSectionWithProducts>(`menus/sections/${sectionId}`, data);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo actualizar la sección con ID ${sectionId}.`);
  }
};

export const deleteSection = async (sectionId: string): Promise<void> => {
  try {
    await apiDelete(`menus/sections/${sectionId}`);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo eliminar la sección con ID ${sectionId}.`);
  }
};

// MENU PRODUCTS
export const createMenuProduct = async (
  product: MenuProductCreate
): Promise<ApiResult<IMenuProduct>> => {
  try {
    return await apiPost<IMenuProduct>(`menus/products`, product);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo crear el producto "${product.name}".`);
  }
};

export const updateMenuProduct = async (
  productId: string,
  data: Partial<MenuProductCreate>
): Promise<ApiResult<IMenuProduct>> => {
  try {
    return await apiPut<IMenuProduct>(`menus/products/${productId}`, data);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo actualizar el producto con ID ${productId}.`);
  }
};

export const deleteMenuProduct = async (productId: string): Promise<void> => {
  try {
    await apiDelete(`menus/products/${productId}`);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo eliminar el producto con ID ${productId}.`);
  }
};

// OPTION GROUPS
export const createOptionGroup = async (
  group: OptionGroupCreate
): Promise<ApiResult<IOptionGroup>> => {
  try {
    return await apiPost<IOptionGroup>(`menus/option-groups`, group);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo crear el grupo de opciones "${group.name}".`);
  }
};

export const updateOptionGroup = async (
  groupId: string,
  data: Partial<OptionGroupCreate>
): Promise<ApiResult<IOptionGroup>> => {
  try {
    return await apiPut<IOptionGroup>(`menus/option-groups/${groupId}`, data);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo actualizar el grupo de opciones con ID ${groupId}.`);
  }
};

export const deleteOptionGroup = async (groupId: string): Promise<void> => {
  try {
    await apiDelete(`menus/option-groups/${groupId}`);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo eliminar el grupo de opciones con ID ${groupId}.`);
  }
};

// OPTIONS
export const createOption = async (option: OptionCreate): Promise<ApiResult<IOption>> => {
  try {
    return await apiPost<IOption>(`menus/options`, option);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo crear la opción "${option.name}".`);
  }
};

export const updateOption = async (
  optionId: string,
  data: Partial<OptionCreate>
): Promise<ApiResult<IOption>> => {
  try {
    return await apiPut<IOption>(`menus/options/${optionId}`, data);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo actualizar la opción con ID ${optionId}.`);
  }
};

export const deleteOption = async (optionId: string): Promise<void> => {
  try {
    await apiDelete(`menus/options/${optionId}`);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo eliminar la opción con ID ${optionId}.`);
  }
};
