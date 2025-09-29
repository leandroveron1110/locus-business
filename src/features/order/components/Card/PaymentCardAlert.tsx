import React, { useState } from 'react';
import { Info, Check, X, AlertTriangle } from "lucide-react";

interface PaymentCardAlertProps {
  type: 'pending' | 'review';
  paymentReceiptUrl: string | null;
  onConfirm: () => void;
  onReject: () => void;
}

export default function PaymentCardAlert({
  type,
  paymentReceiptUrl,
  onConfirm,
  onReject
}: PaymentCardAlertProps) {
  const [isOpen, setIsOpen] = useState(type === 'review'); // Pending colapsable

  const isPending = type === 'pending';

  const config = isPending
    ? {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-800',
        Icon: Info,
        title: 'Pago Pendiente',
        description: 'El cliente pidió pagar por transferencia. Aún no subió el comprobante.',
      }
    : {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-600',
        titleColor: 'text-yellow-800',
        Icon: AlertTriangle,
        title: 'Comprobante de Pago',
        description: 'El cliente subió un comprobante. Revísalo y confirma el pago.',
      };

  return (
    <div
      className={`mt-4 p-4 ${config.bgColor} rounded-lg border ${config.borderColor} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-2">
        <config.Icon className={`w-5 h-5 ${config.iconColor}`} />
        <h4 className={`font-semibold text-sm ${config.titleColor}`}>
          {config.title}
        </h4>
      </div>

      {isOpen && (
        <div className="mt-2">
          <p className="text-xs text-gray-700 mb-2">{config.description}</p>

          {!isPending && paymentReceiptUrl && (
            <a
              href={paymentReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm hover:underline mb-3 inline-block"
            >
              Ver comprobante
            </a>
          )}

          {!isPending && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={(e) => { e.stopPropagation(); onConfirm(); }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
              >
                <Check className="w-4 h-4" /> Confirmar
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onReject(); }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" /> Rechazar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
