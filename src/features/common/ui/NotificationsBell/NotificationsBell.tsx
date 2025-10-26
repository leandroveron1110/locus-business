"use client";

import {
  NotificationType,
  useBusinessNotificationsStore,
} from "@/features/common/hooks/useBusinessNotificationsStore";
import {
  Bell,
  MessageCircle,
  Package,
  ShoppingCart,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import React from "react";

// 🕒 Utilidad para mostrar "hace X tiempo"
function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

  if (diffSec < 60) return rtf.format(-Math.floor(diffSec), "second");
  if (diffSec < 3600) return rtf.format(-Math.floor(diffSec / 60), "minute");
  if (diffSec < 86400) return rtf.format(-Math.floor(diffSec / 3600), "hour");
  return rtf.format(-Math.floor(diffSec / 86400), "day");
}

export const TextWithLineBreaks: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};

interface NotificationsBellProps {
  businessId: string;
}

export function NotificationsBell({ businessId }: NotificationsBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { getNotifications } = useBusinessNotificationsStore();
  const notifications = getNotifications(businessId);
  const count = notifications?.length ?? 0;
  const router = useRouter();

  const sortedNotifications = useMemo(
    () =>
      [...(notifications || [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [notifications]
  );

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "NEW_ORDER":
        return <ShoppingCart size={14} className="text-blue-500" />;
      case "STOCK_LOW":
        return <Package size={14} className="text-red-500" />;
      case "NEW_MESSAGE":
        return <MessageCircle size={14} className="text-green-500" />;
      default:
        return <Bell size={14} className="text-gray-400" />;
    }
  };

  const handleNavigation = (type: NotificationType) => {
    setIsOpen(false);

    let path = `/business/${businessId}/`;
    switch (type) {
      case "NEW_ORDER":
        path += "orders";
        break;
      case "STOCK_LOW":
        path += "products";
        break;
      case "NEW_MESSAGE":
        path += "messages";
        break;
      default:
        path += "dashboard";
    }

    router.push(path);
  };

  return (
    <div className="relative">
      {/* 🔔 Botón Campana */}
      <button
        className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Bell className="w-5 h-5 text-gray-700" />

        {/* 🔴 Badge de Notificaciones */}
        {count > 0 && (
          <span
            className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4
              flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white
              bg-red-600 rounded-full shadow-md"
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* 📬 Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in">
          {/* Header */}
          <div className="p-3 flex justify-between items-center border-b border-gray-100">
            <h5 className="text-sm font-semibold text-gray-800">
              Notificaciones ({businessId.slice(0, 4)}…)
            </h5>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Lista */}
          <div className="max-h-60 overflow-y-auto scroll-smooth">
            {sortedNotifications.length === 0 ? (
              <p className="text-center text-gray-500 text-sm p-4">
                No hay notificaciones nuevas.
              </p>
            ) : (
              sortedNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNavigation(n.type)}
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 flex items-start gap-2 cursor-pointer transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">{getIconForType(n.type)}</div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 break-words whitespace-normal">
                      <TextWithLineBreaks text={n.message} />
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {sortedNotifications.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => handleNavigation("NEW_ORDER")}
                className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
