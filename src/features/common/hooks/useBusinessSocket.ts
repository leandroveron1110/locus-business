// features/common/hooks/useBusinessSocket.ts
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { getSocketForBusiness } from "@/lib/socketManager";

export function useBusinessSocket(businessId: string | undefined): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!businessId) return;

    const socketInstance = getSocketForBusiness(businessId);
    setSocket(socketInstance);

    return () => {
      // 🔹 NO desconectamos el socket aquí (persistente)
      // solo removemos listeners en hooks específicos
    };
  }, [businessId]);

  return socket;
}
