import MainLayout from "layouts/MainLayout";
import MainPage from "pages/Index.vue";
import FoodsPage from "pages/Foods.vue";
import HotelServicesPage from "pages/HotelServices.vue";
import AdditionalServicesPage from "pages/AdditionalServices.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { name: "main", path: "", component: MainPage },
      {
        name: "main.foods",
        path: "foods",
        component: FoodsPage,
      },
      {
        name: "main.hs",
        path: "hs",
        component: HotelServicesPage,
      },
      {
        name: "main.ad-services",
        path: "ad-services",
        component: AdditionalServicesPage,
      },
      {
        name: "main.basket",
        path: "basket",
        component: () => import("pages/Basket.vue"),
      },
      {
        name: "main.notifications",
        path: "notifications",
        component: () => import("pages/Notifications.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
