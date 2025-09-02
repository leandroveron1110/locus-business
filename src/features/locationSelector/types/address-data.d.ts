// src/types/address.ts
export interface AddressData {
  street: string;
  number?: string | null;
  city: string;
  province: string;
  country: string;
  postalCode?: string | null;
  latitude: number;
  longitude: number;
  notes?: string | null;
  apartment?: string | null;
}