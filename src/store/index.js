import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import { BASKET_KEY_LS } from "src/config/basket.config";

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    state: {
      lang: localStorage.getItem("ihotel_lang") || "RU",
      langList: ["RU", "KZ", "EN"],
      appSettings: null,
      basket: JSON.parse(localStorage.getItem(BASKET_KEY_LS)) || [],
      notifications: [],
      notificationsCount: 0,
      showNotificationBadge: true,
    },
    mutations: {
      setLang(state, payload) {
        localStorage.setItem("ihotel_lang", payload);
        state.lang = payload;
      },
      setAppSettings(state, payload) {
        state.appSettings = payload;
      },
      setBasket(state, payload) {
        localStorage.setItem(BASKET_KEY_LS, null);
        state.basket = payload;
      },
      addItemToBasket(state, payload) {
        state.basket.push(payload);
        localStorage.setItem(BASKET_KEY_LS, JSON.stringify(state.basket));
      },
      incrementItemsQtyInBasket(state, payload) {
        const product = state.basket.find(
          (el) => el.id === payload.id && el.type === payload.type
        );
        if (!product) return;
        product.quantity++;
        localStorage.setItem(BASKET_KEY_LS, JSON.stringify(state.basket));
      },
      decrementItemsQtyInBasket(state, payload) {
        const product = state.basket.find(
          (el) => el.id === payload.id && el.type === payload.type
        );
        if (!product) return;
        if (product.quantity === 1) {
          const productIdx = state.basket.findIndex(
            (el) => el.id === payload.id && el.type === payload.type
          );
          state.basket.splice(productIdx, 1);
          localStorage.setItem(BASKET_KEY_LS, JSON.stringify(state.basket));
          return;
        }
        product.quantity--;
        localStorage.setItem(BASKET_KEY_LS, JSON.stringify(state.basket));
      },
      setNotificationsCount(state, payload) {
        state.notificationsCount = payload;
      },
      setNotifications(state, payload) {
        state.notifications = payload;
      },
      setVisibilityOfNotificationBade(state, payload) {
        state.showNotificationBadge = payload;
      },
    },
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
