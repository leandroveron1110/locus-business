import { formatPrice } from "@/features/common/utils/formatPrice";
import { CheckCircle, XCircle } from "lucide-react";

interface OptionCardProps {
  option: {
    name: string;
    maxQuantity: number;
    // Se asume que priceFinal es un string que representa un número (por ejemplo, "0.00" o "19.99")
    priceFinal: string; 
    hasStock: boolean;
  };
}

export default function OptionCard({ option }: OptionCardProps) {
  // Estado para la edición (mantido)
  // Lógica para determinar si el precio es cero para mostrar "Gratis"
  const isFree = parseFloat(option.priceFinal) === 0;

  return (
    <div
      // Diseño más compacto: de flex-col a flex-row para móvil, con menos padding.
      // justify-between para separar Nombre/Estado del Precio.
      className={`flex items-center justify-between gap-4 
        p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border cursor-pointer transition 
        ${
          option.hasStock
            ? "hover:bg-gray-50"
            : "opacity-50 cursor-not-allowed"
        }`}
      onClick={() => option.hasStock}
    >
      
      {/* Información principal: Nombre + Estado */}
      <div className="flex items-center gap-2 flex-grow min-w-0">
        {/* Icono de Stock */}
        {option.hasStock ? (
          <CheckCircle className="text-green-500 w-4 h-4 shrink-0" />
        ) : (
          <XCircle className="text-red-500 w-4 h-4 shrink-0" />
        )}
        
        {/* Nombre de la Opción: Fuente más pequeña para móvil y 'truncate' para evitar desbordamiento */}
        <span 
          className="font-medium text-sm sm:text-base text-gray-800 leading-snug truncate"
          title={option.name || "Sin nombre"} // Añadir title para ver el nombre completo al pasar el ratón
        >
          {option.name || "Sin nombre"}
        </span>
      </div>

      {/* Precio */}
      <div className="flex items-center justify-end flex-shrink-0">
        {/* Mostrar "Gratis" si el precio es 0, sino mostrar el precio formateado */}
        <span className={`font-bold text-base sm:text-lg ml-2 ${isFree ? "text-green-600" : "text-indigo-600"}`}>
          {isFree ? "Gratis" : formatPrice(option.priceFinal)}
        </span>
      </div>
      
      {/* Cantidad Máxima - Comentado (manteniendo tu decisión original) */}
      {/* <div className="flex items-center gap-2 text-gray-600 text-sm">
          <ShoppingCart className="w-4 h-4 shrink-0" />
          <span>Máx. {option.maxQuantity || 1}</span>
      </div> */}
      
    </div>
  );
}