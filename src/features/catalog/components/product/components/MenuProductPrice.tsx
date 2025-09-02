"use client";
import { useState, useEffect, useMemo } from "react";

interface Props {
  finalPrice?: number;
  originalPrice?: number;
  discountPercentage?: number;
  currencyMask?: string;
  onUpdate: (data: {
    finalPrice: number;
    originalPrice: number;
    discountPercentage: number;
  }) => void;
}

export default function MenuProductPrice({
  finalPrice = 0,
  originalPrice = 0,
  discountPercentage = 0,
  currencyMask = "$",
  onUpdate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [productData, setProductData] = useState({
    originalPrice: originalPrice.toString(),
    discountPercentage: discountPercentage.toString(),
  });

  // Sincronizar estado interno con las props si cambian
  useEffect(() => {
    setProductData({
      originalPrice: originalPrice?.toString() || "",
      discountPercentage: discountPercentage?.toString() || "",
    });
  }, [originalPrice, discountPercentage]);

  // Calcular precio final dinámicamente
  const calculatedFinalPrice = useMemo(() => {
    const op = parseFloat(productData.originalPrice);
    const dp = parseFloat(productData.discountPercentage);
    if (isNaN(op) || op <= 0) return productData.originalPrice || "0";
    if (isNaN(dp) || dp <= 0) return op.toFixed(2);
    const final = op - (op * dp) / 100;
    return final.toFixed(2);
  }, [productData]);

  const handleConfirm = () => {
    const op = parseFloat(productData.originalPrice) || 0;
    const dp = parseFloat(productData.discountPercentage) || 0;
    const fp = parseFloat(calculatedFinalPrice) || op;
    onUpdate({
      originalPrice: op,
      discountPercentage: dp,
      finalPrice: fp,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setProductData({
      originalPrice: originalPrice?.toString() || "",
      discountPercentage: discountPercentage?.toString() || "",
    });
    setEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Permitimos que quede vacío mientras el usuario escribe
    if (/^\d*\.?\d*$/.test(value)) {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const hasDiscount = parseFloat(productData.discountPercentage) > 0;
  const showOriginalPrice = parseFloat(productData.originalPrice) > 0;

  return (
    <div className="mb-4 space-y-2">
      {!editing ? (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setEditing(true)}
        >
          <span className="text-2xl font-bold text-gray-900">
            {currencyMask}
            {calculatedFinalPrice}
          </span>
          {hasDiscount && showOriginalPrice && (
            <span className="ml-2 text-lg text-gray-500 line-through">
              {currencyMask}
              {productData.originalPrice}
            </span>
          )}
          {hasDiscount && (
            <span className="ml-2 text-green-600 font-semibold">
              -{productData.discountPercentage}%
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Precio Original</label>
              <div className="flex items-center border-b-2 border-gray-400 focus-within:border-blue-600">
                <span className="text-xl font-bold text-gray-900">{currencyMask}</span>
                <input
                  type="text"
                  name="originalPrice"
                  className="text-2xl font-bold text-gray-900 outline-none w-32 bg-transparent"
                  value={productData.originalPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Descuento</label>
              <div className="flex items-center border-b-2 border-gray-400 focus-within:border-blue-600">
                <input
                  type="text"
                  name="discountPercentage"
                  className="text-2xl font-bold text-green-600 outline-none w-16 text-right bg-transparent"
                  value={productData.discountPercentage}
                  onChange={handleChange}
                />
                <span className="text-xl font-bold text-green-600">%</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Precio Final Calculado:</span>
            <span className="text-xl font-bold text-gray-900">
              {currencyMask}
              {calculatedFinalPrice}
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
