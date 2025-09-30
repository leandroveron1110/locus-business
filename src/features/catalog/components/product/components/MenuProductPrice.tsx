"use client";
import { formatPrice } from "@/features/common/utils/formatPrice";
import { useState, useEffect, useMemo, useRef } from "react";

interface Props {
  finalPrice?: string | number;
  originalPrice?: string | number;
  discountPercentage?: string | number;
  currencyMask?: string;
  onUpdate: (data: {
    finalPrice: number;
    originalPrice: number;
    discountPercentage: number;
  }) => void;
}

export default function MenuProductPrice({
  originalPrice,
  discountPercentage,
  currencyMask = "$",
  onUpdate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [productData, setProductData] = useState<{
    originalPrice: string;
    discountPercentage: string;
  }>({
    originalPrice: "",
    discountPercentage: "",
  });

  const originalPriceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProductData({
      originalPrice: originalPrice?.toString() ?? "",
      discountPercentage: discountPercentage?.toString() ?? "",
    });
  }, [originalPrice, discountPercentage]);

  // 👇 focus automático cuando pasamos a editar
  useEffect(() => {
    if (editing && originalPriceInputRef.current) {
      originalPriceInputRef.current.focus();
      originalPriceInputRef.current.select(); // opcional: selecciona todo el texto
    }
  }, [editing]);

  const calculatedFinalPrice = useMemo(() => {
    if (productData.originalPrice !== "") {
      const op = parseFloat(productData.originalPrice);
      const dp = parseFloat(productData.discountPercentage || "0");
      if (isNaN(op) || op <= 0) return "0";
      if (isNaN(dp) || dp <= 0) return op.toFixed(2);
      return (op - (op * dp) / 100).toFixed(2);
    }
    return "0";
  }, [productData]);

  const handleConfirm = () => {
    const op = parseFloat(productData.originalPrice || "0") || 0;
    const dp = parseFloat(productData.discountPercentage || "0") || 0;
    const fp = parseFloat(calculatedFinalPrice) || op;

    onUpdate({ originalPrice: op, discountPercentage: dp, finalPrice: fp });
    setEditing(false);
  };

  const handleCancel = () => {
    setProductData({
      originalPrice: originalPrice?.toString() ?? "",
      discountPercentage: discountPercentage?.toString() ?? "",
    });
    setEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const hasDiscount = parseFloat(productData.discountPercentage || "0") > 0;
  const showOriginalPrice = parseFloat(productData.originalPrice || "0") > 0;

  return (
    <div className="mb-4 space-y-3">
      {!editing ? (
        <div
          className="flex flex-wrap items-center gap-2 cursor-pointer"
          onClick={() => setEditing(true)}
        >
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
            {formatPrice(calculatedFinalPrice, currencyMask)}
          </span>
          {hasDiscount && showOriginalPrice && (
            <span className="text-lg text-gray-500 line-through">
              {currencyMask}
              {productData.originalPrice}
            </span>
          )}
          {hasDiscount && (
            <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-md">
              -{productData.discountPercentage}%
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Inputs en grid responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Precio Original</label>
              <div className="flex items-center border-b border-gray-300 focus-within:border-blue-600">
                <span className="text-lg font-semibold text-gray-900">{currencyMask}</span>
                <input
                  ref={originalPriceInputRef} // 👈 asignamos el ref
                  type="text"
                  name="originalPrice"
                  className="flex-1 text-lg font-semibold text-gray-900 outline-none bg-transparent pl-1"
                  value={productData.originalPrice || ""}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Descuento</label>
              <div className="flex items-center border-b border-gray-300 focus-within:border-blue-600">
                <input
                  type="text"
                  name="discountPercentage"
                  className="flex-1 text-lg font-semibold text-green-600 outline-none bg-transparent text-right"
                  value={productData.discountPercentage || ""}
                  onChange={handleChange}
                  placeholder="0"
                />
                <span className="text-lg font-semibold text-green-600 ml-1">%</span>
              </div>
            </div>
          </div>

          {/* Precio calculado */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Precio Final Calculado</span>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(calculatedFinalPrice, currencyMask)}
            </span>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Aceptar
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
