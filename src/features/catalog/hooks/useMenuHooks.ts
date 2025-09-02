import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMenuByBusinessId,
  createMenu,
  updateMenu,
  deleteMenu,
  createSection,
  updateSection,
  deleteSection,
  createMenuProduct,
  updateMenuProduct,
  deleteMenuProduct,
  createOptionGroup,
  updateOptionGroup,
  deleteOptionGroup,
  createOption,
  updateOption,
  deleteOption,
  deleteManyOption,
  uploadMenuProductImage,
  deleteMenuProductImage,
} from "../api/catalog-api";
import {
  IMenu,
  MenuCreate,
  SectionCreate,
  MenuProductCreate,
  OptionGroupCreate,
  OptionCreate,
} from "../types/catlog";

// -----------------------------
// MENUS
// -----------------------------

export const useAllMenuByBusinessId = (businessId: string) => {
  return useQuery<IMenu[]>({
    queryKey: ["menu-all-business", businessId],
    queryFn: () => fetchMenuByBusinessId(businessId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60,
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MenuCreate) => createMenu(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({menuId, data}:{menuId: string; data: Partial<MenuCreate>}) => updateMenu(menuId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (menuId: string) => deleteMenu(menuId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

// -----------------------------
// SECTIONS
// -----------------------------

export const useCreateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SectionCreate) => createSection(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: string;
      data: Partial<SectionCreate>;
    }) => updateSection(sectionId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: string) => deleteSection(sectionId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

// -----------------------------
// MENU PRODUCTS
// -----------------------------

export const useCreateMenuProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MenuProductCreate) => createMenuProduct(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useUpdateMenuProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: Partial<MenuProductCreate>;
    }) => updateMenuProduct(productId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useDeleteMenuProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => deleteMenuProduct(productId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

// -----------------------------
// IMAGE
// -----------------------------

export const useUploadMenuProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      menuProductId,
      file,
    }: {
      menuProductId: string;
      file: File;
    }) => uploadMenuProductImage(menuProductId, file),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useDeleteMenuProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (menuProductId: string) =>
      deleteMenuProductImage(menuProductId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

// -----------------------------
// OPTION GROUPS
// -----------------------------

export const useCreateOptionGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OptionGroupCreate) => createOptionGroup(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useUpdateOptionGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: Partial<OptionGroupCreate>;
    }) => updateOptionGroup(groupId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useDeleteOptionGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => deleteOptionGroup(groupId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

// -----------------------------
// OPTIONS
// -----------------------------

export const useCreateOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OptionCreate) => createOption(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useUpdateOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      optionId,
      data,
    }: {
      optionId: string;
      data: Partial<OptionCreate>;
    }) => updateOption(optionId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useDeleteOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (optionId: string) => deleteOption(optionId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};

export const useDeleteManyOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (optionId: string[]) => deleteManyOption(optionId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["menu-all-business"] }),
  });
};
