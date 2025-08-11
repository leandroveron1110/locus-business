export interface ISearchBusinessParams {
  q?: string;
  categoryId?: string;
  city?: string;
  province?: string;
  tags?: string[];
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  openNow?: boolean;
  minRating?: number;
  skip?: number;
  take?: number;
  orderBy?:
    | "name:asc"
    | "name:desc"
    | "averageRating:asc"
    | "averageRating:desc"
    | "createdAt:asc"
    | "createdAt:desc";
  filters?: string;
}

export interface ISearchBusiness {
  data: SearchResultBusiness[];
  total: number;
  skip: number;
  take: number;
}

export interface SearchResultBusiness {
  id: string;
  name: string;
  address?: string;
  city?: string;
  province?: string;
  description?: string; // Podría ser shortDescription o fullDescription
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  categoryNames?: string[];
  tagNames?: string[];
  averageRating?: number;
  reviewCount?: number;
  status?: string;
  isOpenNow?: boolean;
  followersCount: number;
  // Puedes añadir más campos si los necesitas en la UI de búsqueda
}
