"use client";
import React, { useMemo } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/features/common/utils/formatPrice";
import { IMenuProduct } from "../../types/catlog";

interface Props {
  product: IMenuProduct;
  onClick: () => void;
}

const SoldOutLabel = "Agotado";
const MAX_DESC_LENGTH = 120;

export default function CatalogProduct({ product, onClick }: Props) {
  const { available, stock, originalPrice, discountAmount, finalPrice, currencyMask } = product;

  console.log(product)

  const { isAvailable, hasDiscount, discountPercent, discountValue } = useMemo(() => {
    const isAvailable = available && stock > 0;
    const hasDiscount = product.originalPrice ? Number(discountAmount) > 0 : false;
    const discountPercent = hasDiscount
      ? Math.round(
          ((Number(originalPrice) - Number(finalPrice)) / Number(originalPrice)) * 100
        )
      : 0;
    const discountValue = hasDiscount
      ? Number(originalPrice) - Number(finalPrice)
      : 0;
    return { isAvailable, hasDiscount, discountPercent, discountValue };
  }, [available, stock, originalPrice, discountAmount, finalPrice]);

  // ✂️ Cortamos descripción larga
  const shortDescription =
    product.description && product.description.length > MAX_DESC_LENGTH
      ? product.description.slice(0, MAX_DESC_LENGTH) + "…"
      : product.description;

  return (
    <li
      onClick={onClick}
      aria-disabled={!isAvailable}
      role="listitem"
      aria-label={`Producto: ${product.name}. ${
        isAvailable ? "Clic para ver detalles." : "Agotado."
      }`}
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm p-4
        flex flex-col md:flex-row gap-4 transition duration-300
        ${isAvailable ? "hover:shadow-md cursor-pointer" : "opacity-60 cursor-not-allowed"}
      `}
    >
      {/* Imagen */}
      {product.imageUrl && (
        <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 128px"
            loading="lazy"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col flex-grow">
        {/* Título y Badges */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h4>
          <div className="flex gap-1 ml-2">
            {hasDiscount && (
              <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                {discountPercent}% OFF
              </span>
            )}
            {!isAvailable && (
              <span className="bg-gray-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                {SoldOutLabel}
              </span>
            )}
          </div>
        </div>

        {/* Descripción */}
        {shortDescription && (
          <p className="text-gray-600 text-sm mb-3">{shortDescription}</p>
        )}

        {/* Footer */}
        <div className="flex items-end justify-between mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Star className="text-yellow-400" size={14} />
            <span>
              {product.rating ? Number(product.rating).toFixed(1) : "–"}
            </span>
          </div>

          {/* Precios */}
          <div className="flex flex-col items-end text-right">
            {hasDiscount && (
              <>
                <span className="text-xs line-through text-gray-400 leading-none">
                  {formatPrice(originalPrice, currencyMask)}
                </span>
                <span className="text-[11px] text-green-600 font-medium">
                  Ahorrás {formatPrice(discountValue, currencyMask)}
                </span>
              </>
            )}
            <span className="text-lg font-bold text-gray-900 leading-none">
              {formatPrice(finalPrice, currencyMask)}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
