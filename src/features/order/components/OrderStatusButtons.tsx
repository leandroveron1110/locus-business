import { useMemo } from "react";
import {
  Order,
  EOrderStatusBusiness,
  DeliveryType,
  OrderStatus,
} from "../types/order";
import { Package, Truck } from "lucide-react";

interface Props {
  order: Order;
  handleStatusChange: (newStatus: EOrderStatusBusiness) => void;
  setShowDeliverySelector: (show: boolean) => void;
  defaultDeliveryCompanyId: string | null;
  defaultDeliveryCompanyName: string | null;
  handleAssignDelivery: (companyId: string) => Promise<void>;
}

export default function OrderStatusButtons({
  order,
  handleStatusChange,
  setShowDeliverySelector,
  defaultDeliveryCompanyId,
  defaultDeliveryCompanyName,
  handleAssignDelivery,
}: Props) {
  const status = order.status as unknown as OrderStatus;

  const shouldShowAutomaticAssignment = useMemo(() => {
    return (
      status === OrderStatus.READY_FOR_DELIVERY_PICKUP &&
      order.deliveryType !== DeliveryType.PICKUP &&
      !!defaultDeliveryCompanyId
    );
  }, [status, order.deliveryType, defaultDeliveryCompanyId]);

  const buttonClasses =
    "px-4 py-2 text-sm rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200";

  const primaryButton = "bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm";
  const successButton = "bg-green-500 text-white hover:bg-green-600 shadow-sm";
  const secondaryButton = "bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm";
  const infoButton = "bg-purple-500 text-white hover:bg-purple-600 shadow-sm";

  switch (status) {
    case OrderStatus.PENDING:
      // return (
      //   <div className="flex flex-wrap gap-2">
      //     <button
      //       onClick={() => handleStatusChange(EOrderStatusBusiness.CONFIRMED)}
      //       className={`${buttonClasses} ${successButton}`}
      //     >
      //       <Check className="w-4 h-4" /> Confirmar
      //     </button>
      //     <button
      //       onClick={() =>
      //         handleStatusChange(EOrderStatusBusiness.REJECTED_BY_BUSINESS)
      //       }
      //       className={`${buttonClasses} ${dangerButton}`}
      //     >
      //       <X className="w-4 h-4" /> Rechazar
      //     </button>
      //   </div>
      // );
      break;
    case OrderStatus.CONFIRMED:
    case OrderStatus.PREPARING:
      return (
        <button
          onClick={() => {
            const nextStatus =
              order.deliveryType === DeliveryType.PICKUP
                ? EOrderStatusBusiness.READY_FOR_CUSTOMER_PICKUP
                : EOrderStatusBusiness.READY_FOR_DELIVERY_PICKUP;
            handleStatusChange(nextStatus);
          }}
          className={`${buttonClasses} ${primaryButton}`}
        >
          Pedido Completado
        </button>
      );
    case OrderStatus.READY_FOR_CUSTOMER_PICKUP:
      return (
        <button
          onClick={() => handleStatusChange(EOrderStatusBusiness.COMPLETED)}
          className={`${buttonClasses} ${successButton}`}
        >
          Entregado
        </button>
      );
    case OrderStatus.READY_FOR_DELIVERY_PICKUP:
      return (
        <div className="flex flex-wrap gap-2">
          {shouldShowAutomaticAssignment && (
            <button
              onClick={() => handleAssignDelivery(defaultDeliveryCompanyId!)}
              className={`${buttonClasses} ${successButton}`}
            >
              <Package className="w-4 h-4" /> Asignar a {defaultDeliveryCompanyName}
            </button>
          )}
          <button
            onClick={() => setShowDeliverySelector(true)}
            className={`${buttonClasses} ${infoButton}`}
          >
            <Truck className="w-4 h-4" /> Asignar Delivery
          </button>
        </div>
      );
    case OrderStatus.OUT_FOR_PICKUP:
      return (
        <button
          onClick={() => handleStatusChange(EOrderStatusBusiness.COMPLETED)}
          className={`${buttonClasses} ${primaryButton}`}
        >
          Entregado al Delivery
        </button>
      );
    case OrderStatus.DELIVERED:
      return (
        <button
          onClick={() => handleStatusChange(EOrderStatusBusiness.COMPLETED)}
          className={`${buttonClasses} ${secondaryButton}`}
        >
          Marcar como Completada
        </button>
      );
    case OrderStatus.CANCELLED_BY_USER:
    case OrderStatus.REJECTED_BY_BUSINESS:
    case OrderStatus.COMPLETED:
    case OrderStatus.DELIVERY_FAILED:
      return null;
    default:
      return null;
  }
}
