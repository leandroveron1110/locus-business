import axios from "@/lib/api";
import { Order, OrderStatus } from "../types/order";

export const fetchOrdersByBusinessId = async (
  businessId: string
): Promise<Order[]> => {
  const res = await axios.get(`/orders/business/${businessId}`); // endpoint de tu API
  return res.data;
};

export const fetchUpdateOrdersByOrderID = async (
  orderId: string,
  status: string
): Promise<Order> => {
  const res = await axios.patch(`/orders/order/stauts/${orderId}`, { status });
  return res.data;
};

export const fetchDeliveryCompany = async (): Promise<any> => {
  const res = await axios.get(`/delivery/companies`);
  return res.data;
};

export async function fetchAssignCompany(orderId: string, companyId: string) {
  const res = await axios.post(`/delivery/orders/${orderId}/assign-company/${companyId}`);
  return res.data;
}
