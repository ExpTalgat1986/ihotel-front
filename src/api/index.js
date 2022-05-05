import { api } from "boot/axios";

export const Api = {
  getSystemSettings: () => api.get("system-settings"),
  getSections: () => api.get("sections"),
  getAdBanners: () => api.get("advertisements"),
  getFoodCategories: () => api.get("food-categories"),
  getFoods: () => api.get("foods"),
  makeOrder: (data) => api.post("orders", data),
  getHs: () => api.get("hotel-services"),
  getHsCategories: () => api.get("hs-categories"),
  getAdditionalServices: () => api.get("ad-services"),
  getAdditionalServiceCategories: () => api.get("ad-service-categories"),
  sendMessage: (data) => api.post("messages", data),
  getNotifications: () => api.get("notifications"),
};
