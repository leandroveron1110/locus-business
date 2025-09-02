// src/features/business/catalog/store/menuStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Draft } from "immer";

import {
  IMenu,
  IMenuSectionWithProducts,
  IMenuProduct,
  IOptionGroup,
  IOption,
} from "../types/catlog";

// -----------------------------
// Tipos de helpers
// -----------------------------
type IdsMenu = { menuId: string };
type IdsSection = IdsMenu & { sectionId: string };
type IdsProduct = IdsSection & { productId: string };
type IdsGroup = IdsProduct & { groupId: string };
type IdsOption = IdsGroup & { optionId: string };

interface MenuState {
  menus: IMenu[];

  // Base
  setMenus: (menus: IMenu[]) => void;
  clear: () => void;

  // ---- Menu
  addMenu: (menu: IMenu) => void;
  updateMenu: (menuId: string, patch: Partial<IMenu>) => void;
  deleteMenu: (menuId: string) => void;

  // ---- Section
  addSection: (ids: IdsMenu, section: IMenuSectionWithProducts) => void;
  updateSection: (
    ids: IdsSection,
    patch: Partial<IMenuSectionWithProducts>
  ) => void;
  deleteSection: (ids: IdsSection) => void;

  // ---- Product
  addProduct: (ids: IdsSection, product: IMenuProduct) => void;
  updateProduct: (ids: IdsProduct, patch: Partial<IMenuProduct>) => void;
  deleteProduct: (ids: IdsProduct) => void;

  // ---- Group
  addGroup: (ids: IdsProduct, group: IOptionGroup) => void;
  updateGroup: (ids: IdsGroup, patch: Partial<IOptionGroup>) => void;
  deleteGroup: (ids: IdsGroup) => void;

  // ---- Option
  addOption: (ids: IdsGroup, option: IOption) => void;
  updateOption: (ids: IdsOption, patch: Partial<IOption>) => void;
  deleteOption: (ids: IdsOption) => void;

  // ---- Reemplazar IDs temporales tras respuesta del back
  replaceTempId: (
    level: "menu" | "section" | "product" | "group" | "option",
    ids: Partial<IdsOption>, // usa lo necesario según el nivel
    tempId: string,
    realId: string
  ) => void;
}

export const useMenuStore = create<MenuState>()(
  immer<MenuState>((set, get) => ({
    menus: [],

    // Base
    setMenus: (menus) =>
      set((s: Draft<MenuState>) => {
        s.menus = menus;
      }),
    clear: () =>
      set((s: Draft<MenuState>) => {
        s.menus = [];
      }),

    // ---- Menu
    addMenu: (menu) =>
      set((s: Draft<MenuState>) => {
        const exists = s.menus.some((m) => m.id === menu.id);
        if (!exists) {
          menu.sections = [];
          s.menus.push(menu);
        }
      }),

    updateMenu: (menuId, patch) =>
      set((s: Draft<MenuState>) => {
        const menu = s.menus.find((m) => m.id === menuId);
        if (menu) Object.assign(menu, patch);
      }),

    deleteMenu: (menuId) =>
      set((s: Draft<MenuState>) => {
        s.menus = s.menus.filter((m) => m.id !== menuId);
      }),

    // ---- Section
    addSection: ({ menuId }, section) =>
      set((s: Draft<MenuState>) => {
        const menu = s.menus.find((m) => m.id === menuId);
        if (!menu) return;
        if(menu.sections) menu.sections = [];
        const exists = menu.sections.some((sec) => sec.id === section.id);
        if (!exists) {
          section.products = []
          menu.sections.push(section);
        }
      }),

    updateSection: ({ menuId, sectionId }, patch) =>
      set((s: Draft<MenuState>) => {
        const sec = s.menus
          .find((m) => m.id === menuId)
          ?.sections.find((x) => x.id === sectionId);
        if (sec) Object.assign(sec, patch);
      }),

    deleteSection: ({ menuId, sectionId }) =>
      set((s: Draft<MenuState>) => {
        const menu = s.menus.find((m) => m.id === menuId);
        if (!menu) return;
        menu.sections = menu.sections.filter((sec) => sec.id !== sectionId);
      }),

    // ---- Product
    addProduct: ({ menuId, sectionId }, product) =>
      set((s: Draft<MenuState>) => {
        const section = s.menus
          .find((m) => m.id === menuId)
          ?.sections.find((sec) => sec.id === sectionId);
        if (!section) return;
        if(!section.products) section.products = []
        const exists = section.products.some((p) => p.id === product.id);
        if (!exists) section.products.push(product);
      }),

    updateProduct: ({ menuId, sectionId, productId }, patch) =>
      set((s: Draft<MenuState>) => {
        const prod = s.menus
          .find((m) => m.id === menuId)
          ?.sections.find((sec) => sec.id === sectionId)
          ?.products.find((p) => p.id === productId);

        if (prod) Object.assign(prod, patch);
      }),

    deleteProduct: ({ menuId, sectionId, productId }) =>
      set((s: Draft<MenuState>) => {
        const section = s.menus
          .find((m) => m.id === menuId)
          ?.sections.find((sec) => sec.id === sectionId);
        if (!section) return;
        section.products = section.products.filter((p) => p.id !== productId);
      }),

    // ---- Group
    addGroup: ({ menuId, sectionId, productId }, group) =>
      set((s) => {
        const product = s.menus
          .find((m) => m.id === menuId)
          ?.sections.find((sec) => sec.id === sectionId)
          ?.products.find((p) => p.id === productId);

        if (!product) return;

        if (!product.optionGroups) product.optionGroups = []; // 👈 fix

        const exists = product.optionGroups.some((g) => g.id === group.id);
        if (!exists) product.optionGroups.push(group);
      }),

    updateGroup: ({ menuId, sectionId, productId, groupId }, patch) =>
      set((s: Draft<MenuState>) => {
        const group = s.menus
          .find((m) => m.id === menuId)
          ?.sections.find((sec) => sec.id === sectionId)
          ?.products.find((p) => p.id === productId)
          ?.optionGroups.find((g) => g.id === groupId);
        if (group) Object.assign(group, patch);
      }),

    deleteGroup: ({ menuId, sectionId, productId, groupId }) =>
      set((s: Draft<MenuState>) => {
        const product = s.menus
          .find((m) => m.id === menuId)
          ?.sections.find((sec) => sec.id === sectionId)
          ?.products.find((p) => p.id === productId);
        if (!product) return;
        product.optionGroups = product.optionGroups.filter(
          (g) => g.id !== groupId
        );
      }),

    // ---- Option
    addOption: ({ menuId, sectionId, productId, groupId }, option) =>
      set((s: Draft<MenuState>) => {
        const group = s.menus
          .find((m) => m.id === menuId)
          ?.sections.find((sec) => sec.id === sectionId)
          ?.products.find((p) => p.id === productId)
          ?.optionGroups.find((g) => g.id === groupId);
        if (!group) return;
        if(!group.options) group.options = [];
        const exists = group.options.some((op) => op.id === option.id);
        if (!exists) group.options.push(option);
      }),

    updateOption: (
      { menuId, sectionId, productId, groupId, optionId },
      patch
    ) =>
      set((s: Draft<MenuState>) => {
        const option = s.menus
          .find((m) => m.id === menuId)
          ?.sections.find((sec) => sec.id === sectionId)
          ?.products.find((p) => p.id === productId)
          ?.optionGroups.find((g) => g.id === groupId)
          ?.options.find((op) => op.id === optionId);
        if (option) Object.assign(option, patch);
      }),

    deleteOption: ({ menuId, sectionId, productId, groupId, optionId }) =>
      set((s: Draft<MenuState>) => {
        const group = s.menus
          .find((m) => m.id === menuId)
          ?.sections.find((sec) => sec.id === sectionId)
          ?.products.find((p) => p.id === productId)
          ?.optionGroups.find((g) => g.id === groupId);
        if (!group) return;
        group.options = group.options.filter((op) => op.id !== optionId);
      }),

    // ---- Reemplazar IDs temporales tras respuesta del back
    replaceTempId: (level, ids, tempId, realId) =>
      set((s: Draft<MenuState>) => {
        const { menuId, sectionId, productId, groupId } = ids as IdsOption;

        const menu = s.menus.find((m) => m.id === menuId);
        if (!menu) return;

        if (level === "menu") {
          if (menu.id === tempId) menu.id = realId;
          return;
        }

        const section = menu.sections.find((sec) => sec.id === sectionId);
        if (!section) return;

        if (level === "section") {
          if (section.id === tempId) section.id = realId;
          return;
        }

        const product = section.products.find((p) => p.id === productId);
        if (!product) return;

        if (level === "product") {
          if (product.id === tempId) product.id = realId;
          return;
        }

        const group = product.optionGroups.find((g) => g.id === groupId);
        if (!group) return;

        if (level === "group") {
          if (group.id === tempId) group.id = realId;
          return;
        }

        if (level === "option") {
          const opt = group.options.find((o) => o.id === tempId);
          if (opt) opt.id = realId;
        }
      }),
  }))
);
