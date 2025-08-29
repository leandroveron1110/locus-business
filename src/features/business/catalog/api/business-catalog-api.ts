import axios from "@/lib/api";
import { Menu, Product } from "../types/catlog";
import { CreateOrderFull } from "../types/order";
import { Address, AddressCreateDto } from "../types/address";
import { Business } from "../types/business";

export const fetchBusinessID = async (
  businessId: string
): Promise<Business> => {
  const res = await axios.get(`/businesses/business/porfile/${businessId}`); // endpoint de tu API
  
  return res.data;
};