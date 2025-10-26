import { formatPrice } from "@/features/common/utils/formatPrice";
import React from "react";

interface OrderSummaryProps {
  fullName: string;
  address: string | null | undefined;
  totalProduct: number;
  isPickup: boolean;
  isPayment: boolean;
  paymentInfo: string;
  onViewProducts: () => void;
  onViewVoucher: () => void;
  paymentReceiptUrl: string | null;
}

const OrderSummary = ({
  fullName,
  totalProduct,
  address,
  isPayment,
  paymentInfo,
  isPickup,
  paymentReceiptUrl,
  onViewProducts,
  onViewVoucher,
}: OrderSummaryProps) => {
  return (
    <div className="w-full">
      {/* Sección Nombre e Info de Pago (sin cambios) */}
      <div className="text-center text-sm text-gray-700 mb-3">
        <div className="capitalize font-semibold text-gray-800">
          <span className="break-words">{fullName.toUpperCase()}</span>
        </div>

        <div className="text-gray-600 capitalize text-xs mt-1">
          <span className="break-words">{paymentInfo}</span>
        </div>

        <div className="flex flex-col items-center mt-5">
          <span className="text-xs font-medium">TOTAL</span>
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(totalProduct)}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-3">
        {/* Botón VER ORDEN */}
        <button
          className="w-full py-1.5 text-xs font-semibold tracking-wide text-white bg-indigo-600 rounded-full shadow-md transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={onViewProducts}
        >
          Ver orden
        </button>

        {/* Botón VER COMPROBANTE */}
        {isPayment && paymentReceiptUrl && (
          <a
            href={paymentReceiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 text-xs font-semibold tracking-wide text-white bg-indigo-600 rounded-full shadow-md transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
            onClick={onViewVoucher}
          >
            Ver comprobante
          </a>
        )}
      </div>

      {/* Dirección (sin cambios) */}
      <div className="text-center text-xs text-gray-600 mt-3">
        {!isPickup && address ? (
          <>
            <strong>DELIVERY</strong>
            <div className="truncate w-full" title={address}>
              {address.replace(", Concepción del Uruguay", "")}
            </div>
          </>
        ) : (
          <strong>TAKE AWAY</strong>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
