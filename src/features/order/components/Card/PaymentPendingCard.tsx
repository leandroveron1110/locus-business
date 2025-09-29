import { useState } from "react";
import { Info } from "lucide-react";

export default function PaymentPendingCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-600" />
        <h4 className="font-semibold text-sm text-blue-800">
          Pago Pendiente
        </h4>
      </div>

      {isOpen && (
        <p className="text-xs text-gray-700 mt-1">
          El cliente pidió pagar por transferencia. Aún no subió el comprobante.
        </p>
      )}
    </div>
  );
}
