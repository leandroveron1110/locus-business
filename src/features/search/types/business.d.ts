export type BusinessTag = {
  id: string;
  name: string;
};
export type BusinessCategory = {
  id: string;
  name: string;
};

export type BusinessGalery = {
  id: string;
  url: string;
};

export type BusinessRating = {
  averageRating: number;
  ratingsCount: number;
}

export type Review = {
  id: string;
  comment: string;
  value: number;
  user: {
    id: string;
    fullName: string;
  };
};


export type BusinessWeeklySchedule = Partial<
  Record<
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY",
    string[]
  >
>;

export type BusinessFollow = { isFollowing: boolean; count: number };

export interface ModuleConfig {
  enabled: boolean;
  version: string;
}

export interface ModulesConfig {
  [key: string]: ModuleConfig | undefined;
}


export interface Business {
  id: string;
  ownerId: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  address: string;
  phone: string;
  whatsapp: string;
  email?: string;
  statusId?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  instagramUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  logoUrl?: string;
  modulesConfig: ModulesConfig; // puede ser objeto vacío

  latitude?: number | null;
  longitude?: number | null;
  averageRating?: number | null;
  ratingsCount?: number;
  businessPaymentMethod?: BusinessPaymentMethod[];
}



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

