interface Option {
  id: string;
  name: string;
  hasStock: boolean;
  index: number;
  priceFinal: string; // precio con impuestos y descuentos
  priceWithoutTaxes: string;
  taxesAmount: string;
  priceModifierType: "INCREASE" | "NOT_CHANGE" | string; // quizá más tipos según backend
  maxQuantity: number;
  images: string[]; // URLs de imágenes opcionales
}

interface OptionGroup {
  id: string;
  name: string;
  minQuantity: number;
  maxQuantity: number;
  quantityType: "MIN_MAX" | string;
  options: Option[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  finalPrice: number;
  originalPrice?: number;
  currency: string; // Ej: "ARS"
  currencyMask: string; // Ej: "$"
  finalPriceWithoutTaxes: string;
  taxesAmount: string;
  discountAmount: string;
  discountPercentage: string;
  discountType: string[];
  rating: number;
  hasOptions: boolean;
  isMostOrdered: boolean;
  isRecommended: boolean;
  available: boolean;
  stock: number;
  preparationTime: number | null;
  imageUrl: string | null;
  seccionId: string;
  optionGroups: OptionGroup[];
}

interface Section {
  id: string;
  name: string;
  imageUrls: string[];
  index: number; // orden dentro del menú
  products: Product[];
}

export interface Menu {
  id: string;
  businessId: string;
  name: string;
  sections: Section[];
}
