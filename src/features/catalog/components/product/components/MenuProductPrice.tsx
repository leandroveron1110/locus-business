"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Pencil, Check, X, Tag, Percent } from "lucide-react"; // Importamos Tag y Percent
import { formatPrice } from "@/features/common/utils/formatPrice";

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
  const [editing, setEditing] = useState(true);
  const [productData, setProductData] = useState<{
    originalPrice: string;
    discountPercentage: string;
  }>({
    originalPrice: "",
    discountPercentage: "",
  });

  const originalPriceInputRef = useRef<HTMLInputElement>(null);

  // Lógica de estado y cálculo (se mantiene igual)
  useEffect(() => {
    setProductData({
      originalPrice: originalPrice?.toString() ?? "",
      discountPercentage: discountPercentage?.toString() ?? "",
    });
  }, [originalPrice, discountPercentage]);

  useEffect(() => {
    if (editing && originalPriceInputRef.current) {
      originalPriceInputRef.current.focus();
      originalPriceInputRef.current.select();
    }
  }, [editing]);

  const calculatedFinalPrice = useMemo(() => {
    if (productData.originalPrice !== "") {
      const op = parseFloat(productData.originalPrice);
      const dp = parseFloat(productData.discountPercentage || "0");
      if (isNaN(op) || op <= 0) return "0.00";
      if (isNaN(dp) || dp <= 0) return op.toFixed(2);
      return (op - (op * dp) / 100).toFixed(2);
    }
    return "0.00";
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const hasDiscount = parseFloat(productData.discountPercentage || "0") > 0;
  const finalPriceDisplay = formatPrice(calculatedFinalPrice, currencyMask);

  return (
    <div className="mb-3">
      {!editing ? (
        // Modo NO EDICIÓN: Se mantiene compacto y claro.
        <div className="flex items-center gap-2">
          <div
            className="flex items-baseline gap-2 cursor-pointer"
            onClick={() => setEditing(true)}
          >
            {/* Precio Final */}
            <span className="text-xl font-bold text-gray-900 leading-none">
              {finalPriceDisplay}
            </span>

            {/* Precio Original tachado */}
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through leading-none">
                {currencyMask}
                {productData.originalPrice}
              </span>
            )}

            {/* Porcentaje de Descuento */}
            {hasDiscount && (
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded leading-none">
                -{productData.discountPercentage}%
              </span>
            )}
          </div>

          <button
            onClick={() => setEditing(true)}
            className="p-1 text-gray-500 hover:text-indigo-600 transition-colors rounded-full"
            aria-label="Editar Precios"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Modo EDICIÓN: Simplificado para un flujo de trabajo rápido
        <div
          className="flex flex-col gap-2 p-3 border border-indigo-300 rounded-lg bg-indigo-50"
          onKeyDown={handleKeyDown}
        >
          {/* Fila de Inputs (Aún más compacta) */}
          <div className="flex gap-2 w-full">
            {/* Input 1: Precio Original */}
            <InputGroup
              label="Precio Base"
              name="originalPrice"
              value={productData.originalPrice}
              onChange={handleChange}
              ref={originalPriceInputRef}
              currencyMask={currencyMask}
              Icon={Tag}
            />

            {/* Input 2: Descuento */}
            <InputGroup
              label="Desc. %"
              name="discountPercentage"
              value={productData.discountPercentage}
              onChange={handleChange}
              suffix="%"
              Icon={Percent}
              inputClasses="text-green-700"
            />
          </div>

          {/* Indicador de Precio Final Calculado (Destacado y centrado) */}
          <div className="flex justify-between items-center pt-1 mt-1 border-t border-indigo-200">
            <span className="text-sm font-medium text-gray-700">
              Precio Final:
            </span>
            <span className="text-lg font-bold text-indigo-700">
              {finalPriceDisplay}
            </span>
          </div>

          {/* Fila de Botones de Acción (Se mantiene simple y con íconos) */}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="p-1.5 bg-transparent text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              title="Cancelar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleConfirm}
              className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              title="Aceptar (Enter)"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------

// Componente auxiliar para mejorar la UI/UX de los inputs en modo edición
// Usamos forwardRef para permitir el ref del input principal.
interface InputGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currencyMask?: string;
  suffix?: string;
  Icon: React.ElementType;
  inputClasses?: string;
}

const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
  (
    {
      label,
      name,
      value,
      onChange,
      currencyMask,
      suffix,
      Icon,
      inputClasses = "",
    },
    ref
  ) => (
    <div className="flex flex-col w-1/2 min-w-0">
      <div className="flex items-center gap-1 mb-1">
        <Icon className="w-3 h-3 text-gray-600" />
        <label htmlFor={name} className="text-xs font-medium text-gray-600">
          {label}
        </label>
      </div>
      <div className="flex items-center bg-white rounded-md border border-gray-300 focus-within:border-indigo-500 shadow-sm transition-shadow">
        {currencyMask && (
          <span className="text-sm font-semibold text-gray-700 ml-2">
            {currencyMask}
          </span>
        )}
        <input
          ref={ref}
          id={name}
          type="text"
          name={name}
          className={`w-full text-sm font-semibold outline-none bg-transparent py-1.5 px-1 text-right ${inputClasses}`}
          value={value || ""}
          onChange={onChange}
          placeholder="0"
          aria-label={label}
        />
        {suffix && (
          <span className="text-sm font-semibold text-gray-700 mr-2">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
);

InputGroup.displayName = "InputGroup";
