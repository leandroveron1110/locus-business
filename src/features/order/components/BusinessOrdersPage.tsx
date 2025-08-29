// src/components/BusinessOrdersPage.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchDeliveryCompany } from "../api/catalog-api";
import { useBusinessOrdersSocket } from "../stores/useBusinessOrdersSocket";
import { useBusinessOrdersStore } from "../stores/useBusinessOrdersStore";
import { useFetchBusinessOrders } from "../stores/useFetchBusinessOrders";
import { EOrderStatusBusiness, Order } from "../types/order";
import { Search } from "lucide-react";
import BusinessOrderCard from "./BusinessOrderCard";

interface Props {
  businessId: string;
}

export default function BusinessOrdersPage({ businessId }: Props) {
  useFetchBusinessOrders(businessId);
  useBusinessOrdersSocket(businessId);

  const orders = useBusinessOrdersStore((s) => s.orders as Order[]);

  const [deliveryCompanies, setDeliveryCompanies] = useState<
    { id: string; name: string }[]
  >([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    EOrderStatusBusiness | "ALL"
  >("ALL");

  useEffect(() => {
    fetchDeliveryCompany()
      .then(setDeliveryCompanies)
      .catch((e) => console.error("Error cargando delivery companies", e));
  }, []);

  // Filtrado + búsqueda
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user.phone && order.user.phone.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">📦 Gestión de Órdenes</h1>

      {/* Buscador y filtros */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID, cliente o teléfono..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full md:w-auto border rounded-lg px-3 py-2 text-gray-700"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="ALL">Todos los estados</option>
          {Object.values(EOrderStatusBusiness).map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de órdenes */}
      {filteredOrders.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">No se encontraron órdenes para este negocio.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <BusinessOrderCard key={order.id} order={order} deliveryCompanies={deliveryCompanies} />
          ))}
        </div>
      )}
    </div>
  );
}