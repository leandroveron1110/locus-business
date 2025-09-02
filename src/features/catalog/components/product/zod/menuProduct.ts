import { z } from "zod";

// Precio de una opción o producto
export const priceSchema = z
  .number({ invalid_type_error: "El precio debe ser un número" })
  .positive("El precio debe ser mayor a 0");

// Nombre de producto u opción
export const nameSchema = z.string().min(1, "El nombre no puede estar vacío");

// Stock y disponibilidad
export const stockSchema = z.object({
  available: z.boolean(),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  preparationTime: z
    .number()
    .int()
    .nonnegative("El tiempo de preparación no puede ser negativo")
    .nullable(),
});

// Flags del producto
export const flagsSchema = z.object({
  isMostOrdered: z.boolean().optional(),
  isRecommended: z.boolean().optional(),
});

// Precio completo del producto
export const productPriceSchema = z.object({
  finalPrice: priceSchema,
  originalPrice: priceSchema.optional(),
  discountPercentage: z
    .number()
    .min(0, "El descuento no puede ser negativo")
    .max(100, "El descuento no puede ser mayor a 100")
    .optional(),
  currencyMask: z.string().optional(),
});
