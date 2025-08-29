// src/interfaces/business-payment-method.ts
export interface BusinessPaymentMethod {
  id: string;
  businessId: string;
  alias: string;
  account: string;
  holderName: string;
  instructions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// src/interfaces/business.ts
export interface Business {
  id: string;
  ownerId: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  statusId: string;
  createdAt: string;
  updatedAt: string;
  instagramUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  latitude?: string;
  longitude?: string;
  averageRating?: string;
  ratingsCount?: number;
  logoId?: string;
  logoUrl?: string;
  businessPaymentMethod?: BusinessPaymentMethod[]; // <-- Usamos la interfaz anidada aquí
}