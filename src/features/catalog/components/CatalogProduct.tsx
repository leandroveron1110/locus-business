import React from "react";
import { Star } from "lucide-react";
import { IMenuProduct } from "../types/catlog";

interface Props {
  product: IMenuProduct;
  onClick: () => void;
}

export default function CatalogProduct({ product, onClick }: Props) {
  const isAvailable = product.available && product.stock > 0;
  const hasDiscount = product.originalPrice ? Number(product.discountAmount) > 0 : false;

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.originalPrice) - Number(product.finalPrice)) /
          Number(product.originalPrice)) *
          100
      )
    : 0;

  return (
    <li
      onClick={true ? onClick : undefined}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex justify-between items-center gap-4 transition-shadow duration-300 ${
        true
          ? "hover:shadow-md cursor-pointer"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      {/* Textual content */}
      <div className="flex flex-col flex-grow justify-between h-full">
        {/* Header: Nombre y badge */}
        <div className="flex items-start justify-between mb-1">
          <h4 className="text-base font-semibold text-gray-900">
            {product.name}
          </h4>
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md ml-2 whitespace-nowrap">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Descripción */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
          {product.description}
        </p>

        {/* Precio y Rating */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Star className="text-yellow-400" size={14} />
            <span>
              {product.rating ? Number(product.rating).toFixed(1) : "–"}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-base font-bold text-gray-900 leading-none">
              {product.currencyMask}{" "}
              {(Number(product.finalPrice) || 0).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs line-through text-gray-400 leading-none">
                {product.currencyMask}{" "}
                {(Number(product.originalPrice) || 0).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Imagen al costado */}
      {product.imageUrl && (
        <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border border-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </li>
  );
}
