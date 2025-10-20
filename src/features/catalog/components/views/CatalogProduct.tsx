"use client";
import React, { useMemo } from "react";
import { Star, Package } from "lucide-react"; // 👈 agregamos un icono para fallback
import Image from "next/image";
import { formatPrice } from "@/features/common/utils/formatPrice";
import { IMenuProduct } from "../../types/catlog";

interface Props {
  product: IMenuProduct;
  onClick: () => void;
}

export default function CatalogProduct({ product, onClick }: Props) {
  const {
    available,
    stock,
    originalPrice,
    discountPercentage,
    finalPrice,
    currencyMask,
  } = product;

  const { isAvailable, hasDiscount, discountPercent } = useMemo(() => {
    const isAvailable = available && stock > 0;
    const hasDiscount = product.originalPrice
      ? Number(discountPercentage) > 0
      : false;
    const discountPercent = hasDiscount
      ? Math.round(
          ((Number(originalPrice) - Number(finalPrice)) /
            Number(originalPrice)) *
            100
        )
      : 0;
    const discountValue = hasDiscount
      ? Number(originalPrice) - Number(finalPrice)
      : 0;
    return { isAvailable, hasDiscount, discountPercent, discountValue };
  }, [
    available,
    stock,
    originalPrice,
    discountPercentage,
    finalPrice,
    product.originalPrice,
  ]);

  return (
    <li
      onClick={onClick}
      aria-disabled={!isAvailable}
      role="listitem"
      className={`
    rounded-2xl border border-gray-200 p-3 h-auto transition
    ${
      isAvailable
        ? "cursor-pointer hover:shadow-md"
        : "cursor-not-allowed opacity-50"
    }
    `}
    >
      <div className="flex flex-col">
        <div className="flex justify-end gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={10}
              className={
                i < Math.round(Number(product.rating) || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>

        <div className="flex gap-3 items-start ">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center bg-gray-50">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 96px"
                loading="lazy"
              />
            ) : (
              <Package className="w-12 h-12 text-gray-400" />
            )}
          </div>

          <div className="flex flex-col flex-grow justify-center">
            {/* Título */}
            <h4 className="text-sm font-semibold text-gray-900 uppercase pr-2 line-clamp-1">
              {product.name}
            </h4>

            {/* Descripción (condicional) */}
            {product.description && (
              <p className="text-gray-600 text-[10px] line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Precio y descuento (condicional) */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-base font-semibold text-gray-900">
                  {formatPrice(finalPrice, currencyMask)}{" "}
                  {hasDiscount && (
                    <span className="text-[10px] text-green-600 font-medium">
                      {discountPercent}% OFF
                    </span>
                  )}
                </span>
                {hasDiscount && (
                  <span className="text-[10px] line-through text-gray-400">
                    {formatPrice(originalPrice, currencyMask)}
                  </span>
                )}
              </div>
            </div>

            {/* Badges (condicionales) */}
            <div className="flex gap-2 mt-1">
              {product.isMostOrdered && (
                <span className="border border-green-600 text-green-600 text-[8px] px-1.5 py-0.5 rounded-full">
                  MÁS VENDIDO
                </span>
              )}
              {product.isRecommended && (
                <span className="border border-green-600 text-green-600 text-[8px] px-1.5 py-0.5 rounded-full">
                  MÁS PEDIDO
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
