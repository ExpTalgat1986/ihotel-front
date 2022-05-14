<template>
  <q-page class="basket-page">
    <div class="page-title q-mb-xl">
      {{ basketText }} <span class="basket-counter"> {{ itemsInBasket }} </span>
    </div>
    <template v-if="itemsInBasket">
      <div class="menu">
        <div class="menu__items">
          <menu-item
            v-for="item in basket"
            :key="item.id"
            :item="item"
            :item-type="item.type"
          />
        </div>
      </div>
      <q-separator class="q-mb-md"></q-separator>
      <q-form @submit="makeOrder">
        <q-input
          filled
          v-model="roomNumber"
          :label="roomNumberText"
          class="q-mb-sm"
          type="number"
          lazy-rules
          :rules="[(val) => val > 0 || 'Поле обязательное']"
        />
        <q-input
          filled
          v-model="fullName"
          :label="fullNameText"
          lazy-rules
          :rules="[(val) => (val && val.length > 1) || 'Поле обязательное']"
        />
        <div class="basket-footer">
          <div class="basket-footer__left">
            <div class="basket-footer__title">{{ totalText }}</div>
            <div class="basket-footer__price">{{ totalPrice }} ₸</div>
          </div>
          <button class="basket-footer__btn" :disabled="isLoading">
            <span v-show="!isLoading">{{ orderText }}</span>
            <q-spinner
              v-show="isLoading"
              color="white"
              size="1.5em"
              :thickness="4"
            />
          </button>
        </div>
      </q-form>
    </template>
  </q-page>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import MenuItem from "components/MenuItem";
import { Api } from "src/api";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "BasketPage",
  components: { MenuItem },
  setup() {
    const store = useStore();
    const roomNumber = ref("");
    const fullName = ref("");
    const isLoading = ref(false);
    const q = useQuasar();
    const router = useRouter();

    const itemsInBasket = computed(() => {
      return store.state.basket.reduce(
        (accumulate, el) => accumulate + Number(el.quantity),
        0
      );
    });

    const totalPrice = computed(() => {
      if (!store.state.basket.length) return 0;
      const total = store.state.basket.reduce(
        (accumulate, el) => accumulate + Number(el.price * el.quantity),
        0
      );
      return new Intl.NumberFormat("ru-RU", { currency: "KZT" }).format(total);
    });

    const basket = computed(() => {
      return store.state.basket;
    });

    const totalText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU" ? "Итого" : lang === "KZ" ? "Барлығы" : "Total";
    });

    const orderText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU" ? "Заказать" : lang === "KZ" ? "Тапсырыс" : "Order";
    });

    const basketText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU" ? "Корзина" : lang === "KZ" ? "Себет" : "Basket";
    });

    const roomNumberText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Номер комнаты"
        : lang === "KZ"
        ? "Бөлме нөмірі"
        : "Room number";
    });

    const successfullyOrderText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Ваш заказ успешно оформлен"
        : lang === "KZ"
        ? "Сіздің тапсырысыңыз сәтті рәсімделді"
        : "Your order has been successfully placed";
    });

    const fullNameText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU" ? "ФИО" : lang === "KZ" ? "Аты-жөні" : "Full name";
    });

    const makeOrder = async () => {
      const data = {
        order_list: store.state.basket,
        full_name: fullName.value,
        guest_number: String(roomNumber.value),
      };
      try {
        isLoading.value = true;
        await Api.makeOrder(data);
        await Api.sendFmcPush({
          type: 'ORDER',
          message: 'Клиент сделал новый заказ, обработайте пожалуйста'
        })
        q.notify({
          message: successfullyOrderText.value,
          position: "top-right",
          timeout: 3500,
          icon: "done",
        });
        store.commit("setBasket", []);
        await router.push({ name: "main" });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      roomNumber,
      fullName,
      isLoading,
      itemsInBasket,
      basket,
      totalPrice,
      orderText,
      totalText,
      basketText,
      roomNumberText,
      fullNameText,
      makeOrder,
    };
  },
});
</script>

<style lang="scss">
.basket {
  &-page {
    padding: 30px 15px 0 15px;
  }

  &-counter {
    margin-left: 15px;
    padding: 7px 13px;
    background: #5d4539;
    box-shadow: 10px 20px 100px rgba(42, 48, 55, 0.05);
    border-radius: 15px;
    font-weight: 700;
    font-size: 16px;
    line-height: 80%;
    color: #ffffff;
  }
}
</style>
