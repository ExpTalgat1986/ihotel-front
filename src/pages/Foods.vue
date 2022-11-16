<template>
  <q-page class="sections-page">
    <div class="sections-top-img">
      <q-img
        :src="require('assets/images/meal.png')"
        style="width: 100%; height: 100%"
        fit="fill"
      >
      </q-img>
    </div>
    <div class="sections-block">
      <div class="sections-block__title">
        {{ foodOrderText }}
      </div>
      <div class="categories q-mb-lg">
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
    <q-dialog v-model="isImageModalVisible">
      <q-card>
        <img :src="imagesSrcInModal" alt="picture" style="height: 220px" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { Api } from "src/api";
import { useStore } from "vuex";
import MenuItem from "components/MenuItem";
import BasketFooter from "components/BasketFooter";
import { FOOD_TYPE_NAME } from "src/config/basket.config";

export default defineComponent({
  name: "FoodsPage",
  components: { BasketFooter, MenuItem },
  setup() {
    const store = useStore();
    const foods = ref([]);
    const categories = ref([]);
    const isImageModalVisible = ref(false);
    const imagesSrcInModal = ref("");

    const foodOrderText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Заказ еды"
        : lang === "KZ"
        ? "Тағамға тапсырыс"
        : "Order food";
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
        (el) => el.category_id === selectedCategory.value.id && el.is_available
      );
    });

    const setSelectedCategory = (id) => {
      categories.value.forEach((el) => {
        el.id === id ? (el.is_active = true) : (el.is_active = false);
      });
    };

    const fetchCategories = async () => {
      const { data } = await Api.getFoodCategories();
      if (data && data.length) {
        data.forEach((el, idx) => {
          el.is_active = idx === 0;
        });
      }
      categories.value = data;
    };

    const fetchFoods = async () => {
      const { data } = await Api.getFoods();
      if (data && Array.isArray(data)) {
        data.forEach((el) => (el.type = FOOD_TYPE_NAME));
      }
      foods.value = data;
    };

    const showImageInModal = (url) => {
      isImageModalVisible.value = true;
      imagesSrcInModal.value = url;
    };

    onBeforeMount(async () => {
      await fetchCategories();
      await fetchFoods();
    });

    return {
      foodOrderText,
      selectedLang,
      categories,
      selectedCategory,
      selectedCategoryFoods,
      isImageModalVisible,
      imagesSrcInModal,
      setSelectedCategory,
      showImageInModal,
    };
  },
});
</script>
