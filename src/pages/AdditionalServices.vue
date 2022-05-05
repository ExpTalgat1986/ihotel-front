<template>
  <q-page class="sections-page">
    <div class="sections-top-img">
      <q-img
        :src="require('assets/images/additional-service.png')"
        style="width: 100%; height: 100%"
        fit="fill"
      >
      </q-img>
    </div>
    <div class="sections-block">
      <div class="sections-block__title" v-html="additionalServiceText"></div>
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
          />
        </div>
      </div>
    </div>
    <basket-footer />
  </q-page>
</template>

<script>
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { Api } from "src/api";
import { useStore } from "vuex";
import MenuItem from "components/MenuItem";
import BasketFooter from "components/BasketFooter";
import { ADDITIONAL_SERVICE_TYPE_NAME } from "src/config/basket.config";

export default defineComponent({
  name: "AdditionalServicesPage",
  components: { BasketFooter, MenuItem },
  setup() {
    const store = useStore();
    const foods = ref([]);
    const categories = ref([]);
    const isImageModalVisible = ref(false);
    const imagesSrcInModal = ref("");

    const additionalServiceText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Дополнительно <br /> в номер"
        : lang === "KZ"
        ? "Нөмірге <br /> қосымша <br /> тапсырыс"
        : "Additionally to <br /> the room";
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

    const fetchCategories = async () => {
      const { data } = await Api.getAdditionalServiceCategories();
      if (data && data.length) {
        data.forEach((el, idx) => {
          el.is_active = idx === 0;
        });
      }
      categories.value = data;
    };

    const fetchHs = async () => {
      const { data } = await Api.getAdditionalServices();
      if (data && Array.isArray(data)) {
        data.forEach((el) => (el.type = ADDITIONAL_SERVICE_TYPE_NAME));
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
      additionalServiceText,
      isImageModalVisible,
      imagesSrcInModal,
      showImageInModal,
      setSelectedCategory,
    };
  },
});
</script>
