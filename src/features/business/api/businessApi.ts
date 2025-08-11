import axios from "@/lib/api";
import {
  Business,
  BusinessCategory,
  BusinessFollow,
  BusinessGalery,
  BusinessRating,
  BusinessTag,
  BusinessWeeklySchedule,
  Review,
} from "../types/business";

const baseUrlBusiness = "/businesses/";

/**
 * Obtenemos el negocio
 */
export const fetchBusinessesByID = async (
  businessId: string
): Promise<Business> => {
  const res = await axios.get(`${baseUrlBusiness}${businessId}`); // endpoint de tu API
  return res.data;
};

/**
 * Hace que un usuario siga un negocio.
 */
export const follow = async (
  userId: string,
  businessId: string
): Promise<void> => {
  await axios.post(`${baseUrlBusiness}${businessId}/follow`, { userId });
};

/**
 * Hace que un usuario deje de seguir un negocio.
 */
export const unfollow = async (
  userId: string,
  businessId: string
): Promise<void> => {
  await axios.delete(`${baseUrlBusiness}${businessId}/follow`, {
    data: { userId }, // axios usa `data` en DELETE requests con cuerpo
  });
};

interface FollowParams {
  userId: string;
  businessId: string;
}

export const fetchFollowBusinessAddUser = async ({
  userId,
  businessId,
}: FollowParams) => {
  const res = await axios.post(`/follow/${userId}/${businessId}`);
  return res.data;
};
export const fetchFollowers = async (
  businessId: string,
  userId: string | undefined
): Promise<BusinessFollow> => {
  console.log(businessId, userId);
  if (!userId) {
    console.log(businessId, userId);
    const res = await axios.get(`/follow/business/${businessId}`); // endpoint de tu API
    return res.data;
  } else {
    console.log("followe LOGEADOOO");
    const res = await axios.get(`/follow/business/${businessId}/${userId}`); // endpoint de tu API
    return res.data;
  }
};

// Tag
export const fetchBusinessTags = async (
  businessId: string
): Promise<BusinessTag[]> => {
  const res = await axios.get(`${baseUrlBusiness}${businessId}/tags/tags`);
  return res.data;
};

// Category
export const fetchBusinessCategories = async (
  businessId: string
): Promise<BusinessCategory[]> => {
  const res = await axios.get(`/business/${businessId}/categories/category`);
  return res.data;
};

/**
 * Feach Schedule
 */
export const fetchBusinessSchedule = async (
  businessId: string
): Promise<BusinessWeeklySchedule> => {
  const res = await axios.get(`/weekly-schedules/by-business/${businessId}`);
  return res.data;
};

/**
 * Feach Galery basic
 */
export const fetchBusinessGaleryBasic = async (
  businessId: string
): Promise<BusinessGalery[]> => {
  const res = await axios.get(`/businesses/${businessId}/gallery`);
  return res.data;
};

export const fetchSummary = async (
  businessId: string
): Promise<BusinessRating> => {
  const res = await axios.get(`/ratings/summary/${businessId}`);
  return res.data;
};

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

export const fetchCommentsByBusinessId = async (
  businessId: string
): Promise<Review[]> => {
  const res = await axios.get(`/ratings/comments/${businessId}`);
  return res.data;
};
