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
import { handleApiError } from "@/lib/handleApiError";

// ================================================================= //
//                            BUSINESS                             //
// ================================================================= //

export const fetchBusinessesByID = async (
  businessId: string
): Promise<Business> => {
  try {
    const res = await axios.get(`business/${businessId}`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener el negocio");
  }
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

export const fetchBusinessConctat = async (
  businessId: string,
  data: ContactUpdateData
) => {
  try {
    const response = await axios.patch(`/business/${businessId}`, { ...data });
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al actualizar contacto del negocio");
  }
};

// ================================================================= //
//                              FOLLOW                              //
// ================================================================= //

interface FollowParams {
  userId: string;
  businessId: string;
}

export const follow = async ({ userId, businessId }: FollowParams): Promise<void> => {
  try {
    await axios.post(`business/${businessId}/follow`, { userId });
  } catch (error: unknown) {
    throw handleApiError(error, "Error al seguir el negocio");
  }
};

export const fetchFollowBusinessAddUser = async ({ userId, businessId }: FollowParams) => {
  try {
    const res = await axios.post(`/follow/${userId}/${businessId}`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al agregar el follow");
  }
};

export const unfollow = async ({ userId, businessId }: FollowParams): Promise<void> => {
  try {
    await axios.delete(`business/${businessId}/follow`, { data: { userId } });
  } catch (error: unknown) {
    throw handleApiError(error, "Error al dejar de seguir el negocio");
  }
};

export const fetchFollowers = async (
  businessId: string,
  userId?: string
): Promise<BusinessFollow> => {
  try {
    const url = userId
      ? `/follow/business/${businessId}/${userId}`
      : `/follow/business/${businessId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los seguidores");
  }
};

// ================================================================= //
//                              TAGS                               //
// ================================================================= //

interface UpdateBusinessTagsDto {
  tagIds: string[];
}

export const fetchGetTags = async (): Promise<Tag[]> => {
  try {
    const res = await axios.get(`/tags`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los tags");
  }
};

export const fetchBusinessTags = async (businessId: string): Promise<BusinessTag[]> => {
  try {
    const res = await axios.get(`business/${businessId}/tags/tags`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los tags del negocio");
  }
};

export const updateBusinessTags = async (businessId: string, tagIds: string[]) => {
  try {
    const updateDto: UpdateBusinessTagsDto = { tagIds };
    const { data } = await axios.patch(`/business/${businessId}/tags`, updateDto);
    return data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al actualizar los tags del negocio");
  }
};

// ================================================================= //
//                            CATEGORIES                           //
// ================================================================= //

interface UpdateBusinessCategoriesDto {
  categoryIds: string[];
}

export const fetchGetCategories = async (): Promise<Category[]> => {
  try {
    const res = await axios.get(`/categories`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener las categorías");
  }
};

export const fetchBusinessCategories = async (
  businessId: string
): Promise<BusinessCategory[]> => {
  try {
    const res = await axios.get(`/business/${businessId}/categories/category`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener las categorías del negocio");
  }
};

export const updateBusinessCategories = async (
  businessId: string,
  categoryIds: string[]
) => {
  try {
    const updateDto: UpdateBusinessCategoriesDto = { categoryIds };
    const res = await axios.patch(`/business/${businessId}/categories`, updateDto);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al actualizar las categorías del negocio");
  }
};

// ================================================================= //
//                             SCHEDULE                            //
// ================================================================= //

export async function fetchWeeklySchedule(
  businessId: string
): Promise<Record<string, string[]>> {
  try {
    const { data } = await axios.get(`/weekly-schedules/${businessId}`);
    return data as Record<string, string[]>;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al buscar los horarios");
  }
}

export async function updateWeeklySchedule(
  businessId: string,
  payload: Record<string, string[]>
) {
  try {
    const { data } = await axios.post(`/weekly-schedules/${businessId}`, payload);
    return data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al actualizar los horarios");
  }
}

// ================================================================= //
//                              GALLERY                            //
// ================================================================= //

export const fetchBusinessGaleryBasic = async (
  businessId: string
): Promise<BusinessGalery[]> => {
  try {
    const res = await axios.get(`/business/${businessId}/gallery`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener la galería del negocio");
  }
};

export const fetchBusinessDeleteGalery = async (
  businessId: string,
  imageId: string
) => {
  try {
    await axios.delete(`/business/${businessId}/gallery/${imageId}`);
  } catch (error: unknown) {
    throw handleApiError(error, "Error al eliminar la imagen de la galería");
  }
};

// ================================================================= //
//                              RATINGS                            //
// ================================================================= //

export const fetchSummary = async (businessId: string): Promise<BusinessRating> => {
  try {
    const res = await axios.get(`/ratings/summary/${businessId}`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener el resumen de calificaciones");
  }
};

export const fetchSummarySudmi = async (
  businessId: string,
  userId: string,
  value: number,
  comment: string
): Promise<BusinessRating> => {
  try {
    const res = await axios.post(`/ratings`, {
      businessId,
      userId,
      value,
      comment,
    });
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al enviar la calificación");
  }
};

export const fetchCommentsByBusinessId = async (
  businessId: string
): Promise<Review[]> => {
  try {
    const res = await axios.get(`/ratings/comments/${businessId}`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los comentarios del negocio");
  }
};
