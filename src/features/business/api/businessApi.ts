import axios from "@/lib/api";
import {
  Business,
  BusinessCategory,
  BusinessFollow,
  BusinessGalery,
  BusinessRating,
  BusinessTag,
  Review
} from "../types/business";
import { Category, Tag } from "../types/category";

// ================================================================= //
//                            BUSINESS                             //
// ================================================================= //

/**
 * Obtenemos los datos principales de un negocio por su ID.
 */
export const fetchBusinessesByID = async (
  businessId: string
): Promise<Business> => {
  const res = await axios.get(`business/${businessId}`);
  return res.data;
};

// ================================================================= //
//                            CONTACT                                //
// ================================================================= //
export interface ContactUpdateData {
  address?: string;
  addressData?: any;
  phone?: string;
  whatsapp?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}
export const fetchBusinessConctat = async(businessId: string, data: ContactUpdateData) => {
  const response = await axios.patch(`/business/${businessId}`, { ...data });
  return response.data;
}

// ================================================================= //
//                              FOLLOW                              //
// ================================================================= //

/**
 * Parámetros para las funciones de seguir/dejar de seguir.
 */
interface FollowParams {
  userId: string;
  businessId: string;
}

/**
 * Hace que un usuario siga un negocio.
 */
export const follow = async ({ userId, businessId }: FollowParams): Promise<void> => {
  await axios.post(`business/${businessId}/follow`, { userId });
};

export const fetchFollowBusinessAddUser = async ({
  userId,
  businessId,
}: FollowParams) => {
  const res = await axios.post(`/follow/${userId}/${businessId}`);
  return res.data;
};

/**
 * Hace que un usuario deje de seguir un negocio.
 */
export const unfollow = async ({ userId, businessId }: FollowParams): Promise<void> => {
  await axios.delete(`business/${businessId}/follow`, {
    data: { userId },
  });
};

/**
 * Obtiene los seguidores de un negocio. Si se proporciona un `userId`,
 * verifica si ese usuario sigue al negocio.
 */
export const fetchFollowers = async (
  businessId: string,
  userId?: string
): Promise<BusinessFollow> => {
  const url = userId
    ? `/follow/business/${businessId}/${userId}`
    : `/follow/business/${businessId}`;
  const res = await axios.get(url);
  return res.data;
};

// ================================================================= //
//                              TAGS                               //
// ================================================================= //

/**
 * Interfaz para la actualización de tags de un negocio.
 */
interface UpdateBusinessTagsDto {
  tagIds: string[];
}

/**
 * Obtiene la lista completa de todos los tags disponibles.
 */
export const fetchGetTags = async (): Promise<Tag[]> => {
  const res = await axios.get(`/tags`);
  return res.data;
};

/**
 * Obtiene los tags asociados a un negocio específico.
 */
export const fetchBusinessTags = async (
  businessId: string
): Promise<BusinessTag[]> => {
  const res = await axios.get(`business/${businessId}/tags/tags`);
  return res.data;
};

/**
 * Actualiza los tags de un negocio con una nueva lista.
 */
export const updateBusinessTags = async (
  businessId: string,
  tagIds: string[]
) => {
  const updateDto: UpdateBusinessTagsDto = { tagIds };
  const { data } = await axios.patch(`/business/${businessId}/tags`, updateDto);
  return data;
};

// ================================================================= //
//                            CATEGORIES                           //
// ================================================================= //

/**
 * Interfaz para la actualización de categorías de un negocio.
 */
interface UpdateBusinessCategoriesDto {
  categoryIds: string[];
}

/**
 * Obtiene la lista completa de todas las categorías disponibles.
 */
export const fetchGetCategories = async (): Promise<Category[]> => {
  const res = await axios.get(`/categories`);
  return res.data;
};

/**
 * Obtiene las categorías asociadas a un negocio específico.
 */
export const fetchBusinessCategories = async (
  businessId: string
): Promise<BusinessCategory[]> => {
  const res = await axios.get(`/business/${businessId}/categories/category`);
  return res.data;
};

/**
 * Actualiza las categorías de un negocio con una nueva lista.
 */
export const updateBusinessCategories = async (
  businessId: string,
  categoryIds: string[]
) => {
  const updateDto: UpdateBusinessCategoriesDto = { categoryIds };
  const res = await axios.patch(
    `/business/${businessId}/categories`,
    updateDto
  );
  return res.data;
};

// ================================================================= //
//                             SCHEDULE                            //
// ================================================================= //

/**
 * Obtiene el horario de atención semanal de un negocio.
 */
export async function fetchWeeklySchedule(businessId: string) {
  const { data } = await axios.get(`/weekly-schedules/${businessId}`);
  return data as Record<string, string[]>;
}

export async function updateWeeklySchedule(
  businessId: string,
  payload: Record<string, string[]>
) {
  const { data } = await axios.post(`/weekly-schedules/${businessId}`, payload);
  return data;
}


// ================================================================= //
//                              GALLERY                            //
// ================================================================= //

/**
 * Obtiene la galería de un negocio.
 */
export const fetchBusinessGaleryBasic = async (
  businessId: string
): Promise<BusinessGalery[]> => {
  const res = await axios.get(`/business/${businessId}/gallery`);
  return res.data;
};

export const fetchBusinessDeleteGalery = async (
  businessId: string,
  imageId: string
) => {
    await axios.delete(`/business/${businessId}/gallery/${imageId}`);
};


// ================================================================= //
//                              RATINGS                            //
// ================================================================= //

/**
 * Obtiene el resumen de la calificación de un negocio.
 */
export const fetchSummary = async (
  businessId: string
): Promise<BusinessRating> => {
  const res = await axios.get(`/ratings/summary/${businessId}`);
  return res.data;
};

/**
 * Envía una nueva calificación y comentario para un negocio.
 */
export const fetchSummarySudmi = async (
  businessId: string,
  userId: string,
  value: number,
  comment: string
): Promise<BusinessRating> => {
  const res = await axios.post(`/ratings`, {
    businessId,
    userId,
    value,
    comment,
  });
  return res.data;
};

/**
 * Obtiene los comentarios de un negocio por su ID.
 */
export const fetchCommentsByBusinessId = async (
  businessId: string
): Promise<Review[]> => {
  const res = await axios.get(`/ratings/comments/${businessId}`);
  return res.data;
};