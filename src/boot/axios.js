import { boot } from "quasar/wrappers";
import axios from "axios";
import { API_URL } from "src/config/api.config";
import { Notify } from "quasar";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: API_URL });

api.interceptors.response.use(
  (response) => response,
  async function (error) {
    const {
      status,
      data: { message },
    } = error.response;
    const UNAUTHORIZED_STATUS_CODE = 401;
    const INTERNAL_SERVER_ERROR = 500;
    if (status === INTERNAL_SERVER_ERROR) {
      Notify.create({
        position: "top-right",
        type: "negative",
        message: "Упс... Что-то пошло не так... Обратитесь в тех поддержку",
      });
    } else if (
      (message && typeof message === "string") ||
      Array.isArray(message)
    ) {
      Notify({
        position: "top-right",
        type: "negative",
        message: Array.isArray(message) ? message[0] : message,
      });
    } else if (message && message.error) {
      Notify.create({
        position: "top-right",
        type: "negative",
        message: message.error,
      });
    }
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
