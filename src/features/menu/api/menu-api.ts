import axios from "@/lib/api";
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
  const res = await axios.post(`menus/sections`, section);
  return res.data;
};

export const updateSection = async (
  sectionId: string,
  data: Partial<SectionCreate>
): Promise<IMenuSectionWithProducts> => {
  const res = await axios.put(`menus/sections/${sectionId}`, data);
  return res.data;
};

export const deleteSection = async (sectionId: string): Promise<void> => {
  await axios.delete(`menus/sections/${sectionId}`);
};

// -----------------------------
// MENU PRODUCTS
// -----------------------------

export const createMenuProduct = async (
  product: MenuProductCreate
): Promise<IMenuProduct> => {
  const res = await axios.post(`menus/products`, product);
  return res.data;
};

export const updateMenuProduct = async (
  productId: string,
  data: Partial<MenuProductCreate>
): Promise<IMenuProduct> => {
  const res = await axios.put(`menus/products/${productId}`, data);
  return res.data;
};

export const deleteMenuProduct = async (productId: string): Promise<void> => {
  await axios.delete(`menus/products/${productId}`);
};

// -----------------------------
// OPTION GROUPS
// -----------------------------

export const createOptionGroup = async (
  group: OptionGroupCreate
): Promise<IOptionGroup> => {
  const res = await axios.post(`menus/option-groups`, group);
  return res.data;
};

export const updateOptionGroup = async (
  groupId: string,
  data: Partial<OptionGroupCreate>
): Promise<IOptionGroup> => {
  const res = await axios.put(`menus/option-groups/${groupId}`, data);
  return res.data;
};

export const deleteOptionGroup = async (groupId: string): Promise<void> => {
  await axios.delete(`menus/option-groups/${groupId}`);
};

// -----------------------------
// OPTIONS
// -----------------------------

export const createOption = async (option: OptionCreate): Promise<IOption> => {
  const res = await axios.post(`menus/options`, option);
  return res.data;
};

export const updateOption = async (
  optionId: string,
  data: Partial<OptionCreate>
): Promise<IOption> => {
  const res = await axios.put(`menus/options/${optionId}`, data);
  return res.data;
};

export const deleteOption = async (optionId: string): Promise<void> => {
  await axios.delete(`menus/options/${optionId}`);
};
