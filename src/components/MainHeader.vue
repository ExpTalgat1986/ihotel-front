<template>
  <header class="header">
    <div class="lang-select">
      <q-select
        v-show="showLangSelect"
        borderless
        v-model="pickedLanguage"
        :options="languages"
      />
      <q-icon
        v-show="!showLangSelect"
        @click="goToMainPage"
        name="arrow_back_ios"
      ></q-icon>
    </div>
    <div class="app-title">{{ appTitle }}</div>
    <div class="header-notification">
      <q-btn
        @click="goToNotificationsPage"
        round
        dense
        flat
        color="grey-8"
        icon="notifications_none"
      >
        <template v-if="isNotificationBadeVisible">
          <q-badge
            v-show="notificationsCount"
            color="red"
            text-color="white"
            floating
          >
            {{ notificationsCount }}
          </q-badge>
        </template>
      </q-btn>
    </div>
  </header>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "MainHeader",
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const notificationsCount = computed(() => {
      return store.state.notificationsCount;
    });

    const isNotificationBadeVisible = computed(() => {
      return store.state.showNotificationBadge;
    });

    const showLangSelect = computed(() => {
      return route.name === "main";
    });

    const appTitle = computed(() => {
      return store.state.appSettings
        ? store.state.appSettings?.application_name
        : "iHotel";
    });
    const languages = store.state.langList;
    const pickedLanguage = computed({
      get() {
        return store.state.lang;
      },
      set(value) {
        store.commit("setLang", value);
      },
    });

    const goToMainPage = () => {
      router.push({ name: "main" });
    };

    const goToNotificationsPage = () => {
      router.push({ name: "main.notifications" });
    };

    return {
      appTitle,
      languages,
      pickedLanguage,
      showLangSelect,
      notificationsCount,
      isNotificationBadeVisible,
      goToMainPage,
      goToNotificationsPage,
    };
  },
});
</script>
