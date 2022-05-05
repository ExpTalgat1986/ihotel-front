<template>
  <div class="basket-footer__wrapper">
    <q-separator inset />
    <div class="basket-footer">
      <div class="basket-footer__left">
        <div class="basket-footer__title">{{ totalText }}</div>
        <div class="basket-footer__price">{{ totalPrice }} ₸</div>
      </div>
      <button @click="goToBasket" class="basket-footer__btn">
        {{ basketText }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "BasketFooter",
  setup() {
    const store = useStore();
    const router = useRouter();
    const totalPrice = computed(() => {
      if (!store.state.basket.length) return 0;
      const total = store.state.basket.reduce(
        (accumulate, el) => accumulate + Number(el.price * el.quantity),
        0
      );
      return new Intl.NumberFormat("ru-RU", { currency: "KZT" }).format(total);
    });

    const totalText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU" ? "Итого" : lang === "KZ" ? "Барлығы" : "Total";
    });

    const basketText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "В корзину"
        : lang === "KZ"
        ? "Себетке"
        : "To basket";
    });

    const goToBasket = () => router.push({ name: "main.basket" });

    return {
      totalPrice,
      totalText,
      basketText,
      goToBasket,
    };
  },
});
</script>
