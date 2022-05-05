<template>
  <q-page class="notifications-page">
    <div class="page-title q-mb-xl">
      {{ notificationText }}
    </div>
    <q-list>
      <template v-for="item in notifications" :key="item.id">
        <q-separator spaced inset />
        <q-item>
          <q-item-section>
            <q-item-label> {{ item[`title_${selectedLang}`] }} </q-item-label>
            <q-item-label caption>
              {{ item[`text_${selectedLang}`] }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent, computed, onMounted } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "NotificationsPage",
  setup() {
    const store = useStore();

    const notifications = computed(() => {
      return store.state.notifications;
    });

    const selectedLang = computed(() => {
      return store.state.lang.toLowerCase();
    });

    const notificationText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Уведомления"
        : lang === "KZ"
        ? "Хабарламалар"
        : "Notifications";
    });

    onMounted(() => {
      store.commit("setVisibilityOfNotificationBade", false);
    });

    return {
      notifications,
      selectedLang,
      notificationText,
    };
  },
});
</script>

<style lang="scss">
.notifications {
  &-page {
    padding: 30px 15px;
  }
}
</style>
