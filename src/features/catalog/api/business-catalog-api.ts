import axios from "@/lib/api";
import { Business } from "../types/business";

export const fetchBusinessID = async (
  businessId: string
): Promise<Business> => {
  const res = await axios.get(`/business/business/porfile/${businessId}`); // endpoint de tu API
  
  return res.data;
};