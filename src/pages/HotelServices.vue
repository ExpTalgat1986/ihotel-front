<template>
  <q-page class="sections-page">
    <div class="sections-top-img">
      <q-img
        :src="require('assets/images/hotel-service.png')"
        style="width: 100%; height: 100%"
        fit="fill"
      >
      </q-img>
    </div>
    <div class="sections-block">
      <div class="sections-block__title">{{ hotelServicesText }}</div>
      <div class="message-block q-mb-xl">
        <div class="sections-block__title sections-block__subtitle">
          {{ conciergeMsgText }}
        </div>
        <q-input
          v-model="messageToConcierge"
          class="q-mb-md"
          filled
          type="textarea"
          :placeholder="typeMessageText"
        />
        <button @click="showDialogForMessage" class="secondary-btn full-width">
          {{ sendText }}
        </button>
      </div>
      <div class="order-taxi q-mb-xl">
        <div class="sections-block__title text-center text-white">
          {{ youCanOrderTaxiText }}
        </div>
        <button
          @click="showDialogForOrderTaxi"
          class="secondary-btn full-width white-btn"
        >
          {{ orderText }}
        </button>
      </div>
      <div v-if="categories.length" class="categories q-mb-lg">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="setSelectedCategory(category.id)"
          class="categories__btn"
          :class="{ categories__btn_active: category.is_active }"
        >
          {{ category[`title_${selectedLang}`] }}
        </button>
      </div>
      <div class="menu">
        <div class="menu__title">
          {{ selectedCategory[`title_${selectedLang}`] }}
        </div>
        <div v-if="selectedCategoryFoods.length" class="menu__items">
          <menu-item
            v-for="item in selectedCategoryFoods"
            :key="item.id"
            :item="item"
            :item-type="item.type"
            @showImageInModal="showImageInModal"
          />
        </div>
      </div>
    </div>
    <basket-footer />
  </q-page>
  <q-dialog v-model="isImageModalVisible">
    <q-card>
      <img :src="imagesSrcInModal" alt="picture" style="height: 220px" />
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { Api } from "src/api";
import { useStore } from "vuex";
import MenuItem from "components/MenuItem";
import BasketFooter from "components/BasketFooter";
import { HOTEL_SERVICE_TYPE_NAME } from "src/config/basket.config";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "HotelServicesPage",
  components: { BasketFooter, MenuItem },
  setup() {
    const $q = useQuasar();
    const store = useStore();
    const foods = ref([]);
    const categories = ref([]);
    const messageToConcierge = ref("");
    const isImageModalVisible = ref(false);
    const imagesSrcInModal = ref("");

    const hotelServicesText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Услуги отеля"
        : lang === "KZ"
        ? "Қонақ  қызметтері"
        : "Hotel services";
    });

    const conciergeMsgText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Оставьте сообщение дежурному менеджеру"
        : lang === "KZ"
        ? "Кезекші менеджерге хабарлама қалдырыңыз"
        : "Leave a message for the duty manager";
    });

    const typeMessageText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Напишите сообщение"
        : lang === "KZ"
        ? "Хабарлама жазыңыз"
        : "Write a message";
    });

    const sendText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU" ? "Отправить" : lang === "KZ" ? "Жіберу" : "Send";
    });

    const orderText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU" ? "Заказать" : lang === "KZ" ? "Шақыру" : "Order";
    });

    const youCanOrderTaxiText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Вы можете вызвать такси"
        : lang === "KZ"
        ? "Сіз такси шақыра аласыз"
        : "You can call a taxi";
    });

    const successfullyOrderedTaxText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Запрос на заказ такси успешно оформлен"
        : lang === "KZ"
        ? "Таксиге тапсырыс беру сәтті аяқталды"
        : "Taxi order has been successfully placed";
    });

    const taxiOrderingText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Заказ такси"
        : lang === "KZ"
        ? "Таксиге тапсырыс беру"
        : "taxi ordering";
    });

    const roomNumberText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Введите ваш номер комнаты"
        : lang === "KZ"
        ? "Бөлме нөмірін енгізіңіз"
        : "Enter your room number";
    });

    const msgToConciergeText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Сообщение консьержу"
        : lang === "KZ"
        ? "Консьержге хабарлама"
        : "Message to the concierge";
    });

    const msgSentSuccessfullyText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Сообщение успешно отправлено"
        : lang === "KZ"
        ? "Хабарлама сәтті жіберілді"
        : "The message was sent successfully";
    });

    const selectedLang = computed(() => {
      return store.state.lang.toLowerCase();
    });

    const selectedCategory = computed(() => {
      if (!categories.value.length) return {};
      return categories.value.find((el) => el.is_active);
    });

    const selectedCategoryFoods = computed(() => {
      return foods.value.filter(
        (el) => el.category_id === selectedCategory.value.id
      );
    });

    const setSelectedCategory = (id) => {
      categories.value.forEach((el) => {
        el.id === id ? (el.is_active = true) : (el.is_active = false);
      });
    };

    const showDialogForMessage = () => {
      if (!messageToConcierge.value.length) return;
      $q.dialog({
        title: msgToConciergeText.value,
        message: roomNumberText.value,
        prompt: {
          model: "",
          isValid: (val) => val > 0,
          type: "number",
        },
      }).onOk(async (data) => {
        await Api.sendMessage({
          guest_number: data,
          message: messageToConcierge.value,
        });
        await Api.sendFmcPush({
          type: "MESSAGE",
          message: "Новое сообщение от клиента",
        });
        messageToConcierge.value = "";
        $q.notify({
          message: msgSentSuccessfullyText.value,
          position: "top-right",
          timeout: 3500,
          icon: "done",
        });
      });
    };

    const showDialogForOrderTaxi = () => {
      $q.dialog({
        title: taxiOrderingText.value,
        message: roomNumberText.value,
        prompt: {
          model: "",
          isValid: (val) => val > 0,
          type: "number",
        },
      }).onOk(async (data) => {
        await Api.sendMessage({
          guest_number: data,
          message: "[SYSTEM]: Заказ такси",
        });
        await Api.sendFmcPush({
          type: "MESSAGE",
          message: "Клиент заказал такси, обработайте заявку",
        });
        $q.notify({
          message: successfullyOrderedTaxText.value,
          position: "top-right",
          timeout: 3500,
          icon: "done",
        });
      });
    };

    const fetchCategories = async () => {
      const { data } = await Api.getHsCategories();
      if (data && data.length) {
        data.forEach((el, idx) => {
          el.is_active = idx === 0;
        });
      }
      categories.value = data;
    };

    const fetchHs = async () => {
      const { data } = await Api.getHs();
      if (data && Array.isArray(data)) {
        data.forEach((el) => (el.type = HOTEL_SERVICE_TYPE_NAME));
      }
      foods.value = data;
    };

    onBeforeMount(async () => {
      await fetchCategories();
      await fetchHs();
    });

    const showImageInModal = (url) => {
      isImageModalVisible.value = true;
      imagesSrcInModal.value = url;
    };

    return {
      selectedLang,
      categories,
      selectedCategory,
      selectedCategoryFoods,
      hotelServicesText,
      messageToConcierge,
      conciergeMsgText,
      typeMessageText,
      sendText,
      orderText,
      youCanOrderTaxiText,
      isImageModalVisible,
      imagesSrcInModal,
      showImageInModal,
      setSelectedCategory,
      showDialogForOrderTaxi,
      showDialogForMessage,
    };
  },
});
</script>
