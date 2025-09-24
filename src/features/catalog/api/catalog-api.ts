import axios from "@/lib/api";
import { CreateOrderFull } from "../types/order";
import { Address, AddressCreateDto } from "../types/address";
import {
  IMenu,
  IMenuProduct,
  IMenuSectionWithProducts,
  IOption,
  IOptionGroup,
  MenuCreate,
  MenuProductCreate,
  OptionCreate,
  OptionGroupCreate,
  SectionCreate,
} from "../types/catlog";
import { handleApiError } from "@/lib/handleApiError";


// -----------------------------
// CATALOG
// -----------------------------

export const fetchCatalogByBusinessID = async (businessId: string): Promise<IMenu[]> => {
  try {
    const res = await axios.get(`/menus/business/all/${businessId}`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener el catálogo del negocio");
  }
};

export const fetchMenuProducDetaillByProductId = async (productId: string): Promise<IMenuProduct> => {
  try {
    const res = await axios.get(`/menu-products/product/${productId}`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener el detalle del producto");
  }
};

export const fetchCreateOrder = async (payload: CreateOrderFull): Promise<any> => {
  try {
    const { data } = await axios.post("/orders/full", payload);
    return data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al crear la orden");
  }
};

export const fetchCreateAddress = async (payload: Address): Promise<AddressCreateDto> => {
  try {
    const { data } = await axios.post("/address", payload);
    return data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al crear la dirección");
  }
};

export const fetchUserAddresses = async (userId: string): Promise<AddressCreateDto[]> => {
  try {
    const res = await axios.get(`/address/user/${userId}`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener las direcciones del usuario");
  }
};

// -----------------------------
// MENUS
// -----------------------------

export const fetchMenuByBusinessId = async (businessId: string): Promise<IMenu[]> => {
  try {
    const res = await axios.get(`menus/business/${businessId}`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los menús del negocio");
  }
};

export const createMenu = async (newMenu: MenuCreate): Promise<IMenu> => {
  try {
    const res = await axios.post(`menus/`, newMenu);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al crear el menú");
  }
};

export const updateMenu = async (menuId: string, data: Partial<MenuCreate>): Promise<IMenu> => {
  try {
    const res = await axios.put(`menus/${menuId}`, data);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al actualizar el menú");
  }
};

export const deleteMenu = async (menuId: string): Promise<void> => {
  try {
    await axios.delete(`menus/${menuId}`);
  } catch (error: unknown) {
    throw handleApiError(error, "Error al eliminar el menú");
  }
};

// -----------------------------
// SECTIONS
// -----------------------------

export const createSection = async (section: SectionCreate): Promise<IMenuSectionWithProducts> => {
  try {
    const res = await axios.post(`menu/secciones`, section);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al crear la sección");
  }
};

export const updateSection = async (sectionId: string, data: Partial<SectionCreate>): Promise<IMenuSectionWithProducts> => {
  try {
    const res = await axios.patch(`menu/secciones/${sectionId}`, data);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al actualizar la sección");
  }
};

export const deleteSection = async (sectionId: string): Promise<void> => {
  try {
    await axios.delete(`menu/secciones/${sectionId}`);
  } catch (error: unknown) {
    throw handleApiError(error, "Error al eliminar la sección");
  }
};

// -----------------------------
// MENU PRODUCTS
// -----------------------------

export const createMenuProduct = async (product: MenuProductCreate): Promise<IMenuProduct> => {
  try {
    const res = await axios.post(`menu-products/`, product);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al crear el producto");
  }
};

export const updateMenuProduct = async (productId: string, data: Partial<MenuProductCreate>): Promise<IMenuProduct> => {
  try {
    const res = await axios.patch(`menu-products/${productId}`, data);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al actualizar el producto");
  }
};

export const deleteMenuProduct = async (productId: string): Promise<void> => {
  try {
    await axios.delete(`menu-products/${productId}`);
  } catch (error: unknown) {
    throw handleApiError(error, "Error al eliminar el producto");
  }
};

// -----------------------------
// IMAGE
// -----------------------------

export const uploadMenuProductImage = async (menuProductId: string, file: File): Promise<{ url: string }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(
      `menu-product-images/upload?menuProductId=${menuProductId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al subir la imagen del producto");
  }
};

export const deleteMenuProductImage = async (menuProductId: string) => {
  try {
    await axios.delete(`menu-product-images?menuProductId=${menuProductId}`);
  } catch (error: unknown) {
    throw handleApiError(error, "Error al eliminar la imagen del producto");
  }
};

// -----------------------------
// OPTION GROUPS
// -----------------------------

export const createOptionGroup = async (group: OptionGroupCreate): Promise<IOptionGroup> => {
  try {
    const res = await axios.post(`option-groups/`, group);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al crear el grupo de opciones");
  }
};

export const updateOptionGroup = async (groupId: string, data: Partial<OptionGroupCreate>): Promise<IOptionGroup> => {
  try {
    const res = await axios.patch(`option-groups/${groupId}`, data);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al actualizar el grupo de opciones");
  }
};

export const deleteOptionGroup = async (groupId: string): Promise<void> => {
  try {
    await axios.delete(`option-groups/${groupId}`);
  } catch (error: unknown) {
    throw handleApiError(error, "Error al eliminar el grupo de opciones");
  }
};

// -----------------------------
// OPTIONS
// -----------------------------

export const createOption = async (option: OptionCreate): Promise<IOption> => {
  try {
    const res = await axios.post(`options/`, option);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al crear la opción");
  }
};

export const updateOption = async (optionId: string, data: Partial<OptionCreate>): Promise<IOption> => {
  try {
    const res = await axios.patch(`options/${optionId}`, data);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al actualizar la opción");
  }
};

export const deleteOption = async (optionId: string): Promise<void> => {
  try {
    await axios.delete(`options/${optionId}`);
  } catch (error: unknown) {
    throw handleApiError(error, "Error al eliminar la opción");
  }
};

export const deleteManyOption = async (optionIds: string[]): Promise<void> => {
  try {
    await axios.delete(`options/multiple`, { data: { ids: optionIds } });
  } catch (error: unknown) {
    throw handleApiError(error, "Error al eliminar múltiples opciones");
  }
};
