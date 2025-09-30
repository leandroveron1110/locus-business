import {
  Business,
  BusinessCategory,
  BusinessFollow,
  BusinessGalery,
  BusinessRating,
  BusinessTag,
  Review,
} from "../types/business";
import { Category, Tag } from "../types/category";
import { handleApiError } from "@/lib/handleApiError";
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  ApiResult,
} from "@/lib/apiFetch";

// ================================================================= //
//                            BUSINESS                             //
// ================================================================= //

export const fetchBusinessesByID = async (
  businessId: string
): Promise<ApiResult<Business>> => {
  try {
    const res = await apiGet<Business>(`business/${businessId}`);
    return res;
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
    await apiPatch(`/business/${businessId}`, { ...data });
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

export const follow = async ({
  userId,
  businessId,
}: FollowParams): Promise<void> => {
  try {
    await apiPost(`business/${businessId}/follow`, { userId });
  } catch (error: unknown) {
    throw handleApiError(error, "Error al seguir el negocio");
  }
};

export const fetchFollowBusinessAddUser = async ({
  userId,
  businessId,
}: FollowParams) => {
  try {
    const res = await apiPost(`/follow/${userId}/${businessId}`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al agregar el follow");
  }
};

export const unfollow = async ({
  userId,
  businessId,
}: FollowParams): Promise<void> => {
  try {
    await apiDelete(`business/${businessId}/follow`, { data: { userId } });
  } catch (error: unknown) {
    throw handleApiError(error, "Error al dejar de seguir el negocio");
  }
};

export const fetchFollowers = async (
  businessId: string,
  userId?: string
): Promise<ApiResult<BusinessFollow>> => {
  try {
    const url = userId
      ? `/follow/business/${businessId}/${userId}`
      : `/follow/business/${businessId}`;
    const res = await apiGet<BusinessFollow>(url);
    return res;
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

export const fetchGetTags = async (): Promise<ApiResult<Tag[]>> => {
  try {
    const res = await apiGet<Tag[]>(`/tags`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los tags");
  }
};

export const fetchBusinessTags = async (
  businessId: string
): Promise<ApiResult<BusinessTag[]>> => {
  try {
    const res = await apiGet<BusinessTag[]>(`business/${businessId}/tags/tags`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los tags del negocio");
  }
};

export const updateBusinessTags = async (
  businessId: string,
  tagIds: string[]
) => {
  try {
    const updateDto: UpdateBusinessTagsDto = { tagIds };
    const data = await apiPatch(`/business/${businessId}/tags`, updateDto);
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

export const fetchGetCategories = async (): Promise<ApiResult<Category[]>> => {
  try {
    const res = await apiGet<Category[]>(`/categories`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener las categorías");
  }
};

export const fetchBusinessCategories = async (
  businessId: string
): Promise<ApiResult<BusinessCategory[]>> => {
  try {
    const res = await apiGet<BusinessCategory[]>(
      `/business/${businessId}/categories/category`
    );
    return res;
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
    const res = await apiPatch(`/business/${businessId}/categories`, updateDto);
    return res;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "Error al actualizar las categorías del negocio"
    );
  }
};

// ================================================================= //
//                             SCHEDULE                            //
// ================================================================= //

export async function fetchWeeklySchedule(
  businessId: string
): Promise<ApiResult<Record<string, string[]>>> {
  try {
    const data = await apiGet<Record<string, string[]>>(
      `/weekly-schedules/${businessId}`
    );
    return data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al buscar los horarios");
  }
}

export async function updateWeeklySchedule(
  businessId: string,
  payload: Record<string, string[]>
) {
  try {
    const data = await apiPost(`/weekly-schedules/${businessId}`, payload);
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
): Promise<ApiResult<BusinessGalery[]>> => {
  try {
    const res = await apiGet<BusinessGalery[]>(
      `/business/${businessId}/gallery`
    );
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener la galería del negocio");
  }
};

export const fetchBusinessDeleteGalery = async (
  businessId: string,
  imageId: string
) => {
  try {
    await apiDelete(`/business/${businessId}/gallery/${imageId}`);
  } catch (error: unknown) {
    throw handleApiError(error, "Error al eliminar la imagen de la galería");
  }
};

export const fetchUploadImageGelery = async (
  businessId: string,
  formData: FormData
): Promise<void> => {
  try {
    await apiPost(`/business/${businessId}/gallery`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: unknown) {
    throw handleApiError(error, "Error al subir la imagen");
  }
};

export const fetchFileUploader = async (
  businessId: string,
  formData: FormData
): Promise< ApiResult<{url: string}>> => {
  try {
    const res = await apiPost<{url: string}>(`/business/${businessId}/logo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al subir la imagen");
  }
};

// ================================================================= //
//                              RATINGS                            //
// ================================================================= //

export const fetchSummary = async (
  businessId: string
): Promise<ApiResult<BusinessRating>> => {
  try {
    const res = await apiGet<BusinessRating>(`/ratings/summary/${businessId}`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "Error al obtener el resumen de calificaciones"
    );
  }
};

export const fetchSummarySudmi = async (
  businessId: string,
  userId: string,
  value: number,
  comment: string
): Promise<ApiResult<BusinessRating>> => {
  try {
    const res = await apiPost<BusinessRating>(`/ratings`, {
      businessId,
      userId,
      value,
      comment,
    });
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al enviar la calificación");
  }
};

export const fetchCommentsByBusinessId = async (
  businessId: string
): Promise<ApiResult<Review[]>> => {
  try {
    const res = await apiGet<Review[]>(`/ratings/comments/${businessId}`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los comentarios del negocio");
  }
};
