<template>
  <div class="menu-item">
    <div class="menu-img">
      <img
        :src="item.image_url"
        alt="Menu image"
        @click="showImageInModal(item.image_url)"
      />
    </div>
    <div class="menu-info">
      <div class="menu-item__title">{{ item[`title_${selectedLang}`] }}</div>
      <div class="menu-item__descr">
        {{ item[`description_${selectedLang}`] }}
      </div>
      <div class="menu-item__price">{{ formatPrice(item.price) }}</div>
    </div>
    <div class="menu-right">
      <div class="menu-basket">
        <div
          v-show="!itemInBasket"
          @click="addProductToBasket(item.id)"
          class="menu-basket-add"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            class="bi bi-plus"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
            />
          </svg>
        </div>

        <div v-if="itemInBasket" class="menu-basket-management">
          <div
            @click="decrementProductInBasket(item.id)"
            class="menu-basket-management-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-dash"
              viewBox="0 0 16 16"
            >
              <path
                d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"
              />
            </svg>
          </div>
          <span>
            {{ itemInBasket.quantity }}
          </span>
          <div
            @click="addProductToBasket(item.id)"
            class="menu-basket-management-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-plus"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { FOOD_TYPE_NAME } from "src/config/basket.config";

export default defineComponent({
  name: "MenuItem",
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    itemType: {
      type: String,
      required: true,
      default: FOOD_TYPE_NAME,
    },
  },

  computed: {
    basket() {
      return this.$store.state.basket;
    },

    selectedLang() {
      return this.$store.state.lang.toLowerCase();
    },

    itemInBasket() {
      if (this.basket && Array.isArray(this.basket)) {
        return this.basket.find(
          (el) => el.id === this.item.id && el.type === this.itemType
        );
      }
      return false;
    },
  },

  methods: {
    formatPrice(price) {
      return (
        new Intl.NumberFormat("ru-RU", { currency: "KZT" }).format(price) + " ₸"
      );
    },

    addProductToBasket(productId) {
      const foundProduct = this.basket.find(
        (el) => el.id === productId && el.type === this.itemType
      );
      if (foundProduct) {
        return this.$store.commit("incrementItemsQtyInBasket", {
          id: foundProduct.id,
          type: this.itemType,
        });
      }
      this.$store.commit("addItemToBasket", {
        id: this.item.id,
        quantity: 1,
        price: this.item.price,
        type: this.itemType,
        ...this.item,
      });
    },

    decrementProductInBasket(productId) {
      this.$store.commit("decrementItemsQtyInBasket", {
        id: productId,
        type: this.itemType,
      });
    },

    showImageInModal(url) {
      this.$emit('showImageInModal', url)
    },
  },
});
</script>
