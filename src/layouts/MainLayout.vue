<template>
  <q-layout view="lHh Lpr lFf">
    <main-header />
    <q-separator inset />
    <div
      v-show="showLogo"
      class="logo"
      :style="{ backgroundImage: `url(${logoUrl})` }"
    ></div>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import MainHeader from "components/MainHeader";
import { computed, defineComponent, onBeforeMount } from "vue";
import { Api } from "src/api";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    MainHeader,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const logoUrl = computed(() => {
      return store.state.appSettings
        ? store.state.appSettings?.main_logo_url
        : "";
    });

    const showLogo = computed(() => {
      return (
        route.name !== "main.basket" && route.name !== "main.notifications"
      );
    });

    const fetchNotifications = async () => {
      const { data } = await Api.getNotifications();
      store.commit("setNotifications", data);
      store.commit("setNotificationsCount", data.length);
    };

    const fetchSystemSettings = async () => {
      const { data } = await Api.getSystemSettings();
      store.commit("setAppSettings", data);
    };

    onBeforeMount(async () => {
      await fetchSystemSettings();
      await fetchNotifications();
    });

    return { logoUrl, showLogo };
  },
});
</script>
