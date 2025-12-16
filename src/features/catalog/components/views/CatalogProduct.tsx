"use client";
import React, { useMemo } from "react";
import { Star, Package, Banknote } from "lucide-react";
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

  // 🔴 Condición: solo efectivo
  const isCashOnly =
    product.acceptsCash && !product.acceptsTransfer && !product.acceptsQr;

  return (
    <div
      onClick={isAvailable ? onClick : undefined}
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
        {/* Imagen + contenido */}
        <div className="flex gap-3 items-start">
          {/* 🖼️ Imagen */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-200 flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            ) : (
              <Package className="w-12 h-12 text-gray-400" />
            )}
          </div>

          {/* 📝 Texto */}
          <div
            className={`
              flex flex-col flex-grow justify-between min-h-[80px]
              ${
                !product.description &&
                !product.isMostOrdered &&
                !product.isRecommended
                  ? "py-1"
                  : ""
              }
            `}
          >
            <div>
              {/* Nombre + rating */}
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-900 uppercase pr-2 line-clamp-1">
                  {product.name}
                </h4>

                <div className="flex items-center text-[11px] text-gray-700 font-medium">
                  {Number(product.rating || 0)}
                  <Star
                    size={12}
                    className="ml-1 text-yellow-400 fill-yellow-400"
                  />
                </div>
              </div>

              {/* Descripción */}
              {product.description && (
                <p className="text-gray-600 text-[10px] line-clamp-2 mt-0.5">
                  {product.description}
                </p>
              )}

              {/* Badges */}
              {(product.isMostOrdered || product.isRecommended) && (
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
              )}

              {/* 🔴 Badge SOLO EFECTIVO */}
              {isCashOnly && (
                <div className="flex mt-1">
                  <span className="flex items-center gap-1 border border-green-600 text-green-600 text-[8px] px-1.5 py-0.5 rounded-full">
                    <Banknote size={10} />
                    SOLO EFECTIVO
                  </span>
                </div>
              )}
            </div>

            {/* Precios */}
            <div className="flex items-end gap-2 mt-1">
              <div className="flex flex-col">
                <span className="text-sm text-gray-900">
                  {formatPrice(finalPrice, currencyMask)}{" "}
                  {hasDiscount && (
                    <span className="text-[10px] text-green-600 font-medium">
                      {discountPercent}% OFF
                    </span>
                  )}
                </span>

                {hasDiscount && (
                  <span className="text-xs line-through text-gray-400">
                    {formatPrice(originalPrice, currencyMask)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
