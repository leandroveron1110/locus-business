export interface Address {
  street: string;
  number?: string;
  apartment?: string;
  city: string;
  province: string;
  country?: string; // valor por defecto: 'Argentina'
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  isDefault?: boolean;
  userId?: string;
}

export interface AddressCreateDto extends Address {
    id: string;
}
