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

export const fetchCatalogByBusinessID = async (
  businessId: string
): Promise<IMenu[]> => {
  const res = await axios.get(`/menus/business/${businessId}`); // endpoint de tu API
  return res.data;
};

export const fetchMenuProducDetaillByProductId = async (
  productId: string
): Promise<IMenuProduct> => {
  const res = await axios.get(`/menu-products/product/${productId}`); // endpoint de tu API
  return res.data;
};

export const fetchCreateOrder = async (
  payload: CreateOrderFull
): Promise<any> => {
  const { data } = await axios.post("/orders/full", payload);
  return data;
};

export const fetchCreateAddress = async (
  payload: Address
): Promise<AddressCreateDto> => {
  const { data } = await axios.post("/address", payload);
  return data;
};

export const fetchUserAddresses = async (
  userId: string
): Promise<AddressCreateDto[]> => {
  const res = await axios.get(`/address/user/${userId}`);
  return res.data;
};

// -----------------------------
// MENUS
// -----------------------------

export const fetchMenuByBusinessId = async (
  businessId: string
): Promise<IMenu[]> => {
  const res = await axios.get(`menus/business/${businessId}`);
  return res.data;
};

export const createMenu = async (newMenu: MenuCreate): Promise<IMenu> => {
  const res = await axios.post(`menus/`, newMenu);
  return res.data;
};

export const updateMenu = async (
  menuId: string,
  data: Partial<MenuCreate>
): Promise<IMenu> => {
  const res = await axios.put(`menus/${menuId}`, data);
  return res.data;
};

export const deleteMenu = async (menuId: string): Promise<void> => {
  await axios.delete(`menus/${menuId}`);
};

// -----------------------------
// SECTIONS
// -----------------------------

export const createSection = async (
  section: SectionCreate
): Promise<IMenuSectionWithProducts> => {
  const res = await axios.post(`menu/secciones`, section);
  return res.data;
};

export const updateSection = async (
  sectionId: string,
  data: Partial<SectionCreate>
): Promise<IMenuSectionWithProducts> => {
  const res = await axios.patch(`menu/secciones/${sectionId}`, data);
  return res.data;
};

export const deleteSection = async (sectionId: string): Promise<void> => {
  await axios.delete(`menu/secciones/${sectionId}`);
};

// -----------------------------
// MENU PRODUCTS
// -----------------------------

export const createMenuProduct = async (
  product: MenuProductCreate
): Promise<IMenuProduct> => {
  const res = await axios.post(`menu-products/`, product);
  return res.data;
};

export const updateMenuProduct = async (
  productId: string,
  data: Partial<MenuProductCreate>
): Promise<IMenuProduct> => {
  const res = await axios.patch(`menu-products/${productId}`, data);
  return res.data;
};

export const deleteMenuProduct = async (productId: string): Promise<void> => {
  await axios.delete(`menu-products/${productId}`);
};

// -----------------------------
// IMAGE
// -----------------------------

export const uploadMenuProductImage = async (
  menuProductId: string,
  file: File
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `menu-product-images/upload?menuProductId=${menuProductId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data; // { url: string }
};


// Eliminar imagen
export const deleteMenuProductImage = async (menuProductId: string) => {
  await axios.delete(`menu-product-images?menuProductId=${menuProductId}`);
};

// -----------------------------
// OPTION GROUPS
// -----------------------------

export const createOptionGroup = async (
  group: OptionGroupCreate
): Promise<IOptionGroup> => {
  const res = await axios.post(`option-groups/`, group);
  return res.data;
};

export const updateOptionGroup = async (
  groupId: string,
  data: Partial<OptionGroupCreate>
): Promise<IOptionGroup> => {
  const res = await axios.patch(`option-groups/${groupId}`, data);
  return res.data;
};

export const deleteOptionGroup = async (groupId: string): Promise<void> => {
  await axios.delete(`option-groups/${groupId}`);
};

// -----------------------------
// OPTIONS
// -----------------------------

export const createOption = async (option: OptionCreate): Promise<IOption> => {
  const res = await axios.post(`options/`, option);
  return res.data;
};

export const updateOption = async (
  optionId: string,
  data: Partial<OptionCreate>
): Promise<IOption> => {
  const res = await axios.patch(`options/${optionId}`, data);
  return res.data;
};

export const deleteOption = async (optionId: string): Promise<void> => {
  await axios.delete(`options/${optionId}`);
};
export const deleteManyOption = async (optionIds: string[]): Promise<void> => {
  await axios.delete(`options/multiple`, { data: { ids: optionIds } });
};
