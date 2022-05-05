<template>
  <q-page>
    <div class="main-page-carousel q-px-sm">
      <q-carousel
        v-if="sections.length"
        animated
        v-model="slide"
        infinite
        swipeable
        height="150px"
        class="shadow-1 rounded-borders"
        :autoplay="3500"
      >
        <q-carousel-slide
          v-for="(section, idx) in sections"
          :key="section.id"
          :name="idx"
          :img-src="section.image_url"
          @click="redirectToSection(section.link)"
        />
      </q-carousel>
    </div>
    <div class="main-page__content">
      <div class="main-page-concierge">
        <span class="main-page-concierge__text"> {{ conciergeText }} </span>
        <div>
          <q-avatar
            @click="redirectToWhatsApp"
            size="lg"
            color="white"
            text-color="primary"
            icon="whatsapp"
            class="q-mx-sm"
          />
          <q-avatar
            @click="redirectToTelegram"
            size="lg"
            color="white"
            text-color="primary"
            icon="telegram"
          />
        </div>
      </div>
      <div class="main-page-services">
        <div v-html="whatYouWantText" class="main-page-services__title"></div>
        <!--        src="~assets/quasar-logo-vertical.svg"-->
        <div class="main-page-blocks">
          <div class="main-page-block__wrapper">
            <div
              class="main-page-block"
              @click="goTo('main.foods')"
              :style="{
                backgroundImage: `url(${require('assets/images/meal.png')})`,
              }"
            ></div>
            <span class="main-page-block__text" v-html="foodOrderText"> </span>
          </div>
          <div class="main-page-block__wrapper">
            <div
              class="main-page-block"
              @click="goTo('main.ad-services')"
              :style="{
                backgroundImage: `url(${require('assets/images/additional-service.png')})`,
              }"
            ></div>
            <span class="main-page-block__text" v-html="additionalServiceText">
            </span>
          </div>
          <div class="main-page-block__wrapper">
            <div
              class="main-page-block"
              @click="goTo('main.hs')"
              :style="{
                backgroundImage: `url(${require('assets/images/hotel-service.png')})`,
              }"
            ></div>
            <span class="main-page-block__text" v-html="hotelServicesText">
            </span>
          </div>
          <div class="main-page-block__wrapper">
            <div
              class="main-page-block"
              :style="{
                backgroundImage: `url(${require('assets/images/about-hotel.png')})`,
              }"
            ></div>
            <span class="main-page-block__text" v-html="aboutHotelText"></span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="bannerToShow" class="ad-banner">
      <q-img
        @click="redirectToSection(bannerToShow.banner_url)"
        :src="bannerToShow.banner_img"
        style="max-width: 100%; height: 100%"
        fit="fill"
      >
      </q-img>
    </div>
    <a href="" style="display: none" class="redirect" target="_blank"></a>
  </q-page>
</template>

<script>
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { Api } from "src/api";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "PageIndex",
  setup() {
    const router = useRouter();
    const store = useStore();
    const slide = ref(0);
    const sections = ref([]);
    const adBanners = ref([]);
    const bannerToShow = computed(() => {
      if (!adBanners.value.length) return null;
      return adBanners.value[0];
    });

    const conciergeText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Ваш мобильный консьерж"
        : lang === "KZ"
        ? "Мобильді консьерж"
        : "Your mobile concierge";
    });

    const whatYouWantText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Что бы вам <br /> хотелось?"
        : lang === "KZ"
        ? "Сіз не <br /> қалайсыз"
        : "What would <br /> you like";
    });

    const foodOrderText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Заказ <br /> еды"
        : lang === "KZ"
        ? "Тағамға <br /> тапсырыс"
        : "Order <br /> food";
    });

    const additionalServiceText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Дополнительно <br /> в номер"
        : lang === "KZ"
        ? "Нөмірге <br /> қосымша <br /> тапсырыс"
        : "Additionally to <br /> the room";
    });

    const hotelServicesText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Услуги <br /> отеля"
        : lang === "KZ"
        ? "Қонақ үй <br /> қызметтері"
        : "Hotel <br /> services";
    });

    const aboutHotelText = computed(() => {
      const lang = store.state.lang;
      return lang === "RU"
        ? "Об <br /> отеле"
        : lang === "KZ"
        ? "Қонақ үй <br /> туралы"
        : "About <br /> the hotel";
    });

    const appSettings = computed(() => {
      return store.state.appSettings;
    });

    const goTo = (name) => {
      router.push({ name });
    };

    const redirectToSection = (url) => {
      const link = document.querySelector(".redirect");
      link.setAttribute("href", url);
      link.click();
      link.setAttribute("href", "");
    };

    const redirectToWhatsApp = () => {
      if (!appSettings.value) return;
      if (appSettings.value.concierge_phone) {
        const url = `https://wa.me/${appSettings.value.concierge_phone}`;
        const link = document.querySelector(".redirect");
        link.setAttribute("href", url);
        link.click();
      }
    };

    const redirectToTelegram = () => {
      if (!appSettings.value) return;
      if (appSettings.value.concierge_telegram) {
        const url = `tg://resolve?domain=${appSettings.value.concierge_telegram}`;
        const link = document.querySelector(".redirect");
        link.setAttribute("href", url);
        link.click();
      }
    };

    const getAdBanners = async () => {
      const { data } = await Api.getAdBanners();
      adBanners.value = data;
    };

    onBeforeMount(async () => {
      const { data } = await Api.getSections();
      sections.value = data;
      await getAdBanners();
    });

    return {
      slide,
      sections,
      bannerToShow,
      conciergeText,
      whatYouWantText,
      foodOrderText,
      additionalServiceText,
      hotelServicesText,
      aboutHotelText,
      goTo,
      redirectToWhatsApp,
      redirectToTelegram,
      redirectToSection,
    };
  },
});
</script>

<style lang="scss">
.main-page {
  &-carousel {
    height: 150px;
  }

  &__content {
    margin-top: 15px;
    background: $primary;
  }

  &-concierge {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;

    &__text {
      color: $white;
      font-weight: bold;
    }
  }

  &-services {
    background: $white;
    padding: 30px 15px 80px 15px;
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;

    &__title {
      color: $dark;
      font-weight: 700;
      font-size: 28px;
      line-height: 85%;
    }
  }

  &-blocks {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 24px;
  }

  &-block {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 30px;

    &__wrapper {
      position: relative;
      width: 48%;
      height: 160px;
      margin-bottom: 15px;
    }

    &__text {
      position: absolute;
      top: 25px;
      left: 15px;
      font-weight: 700;
      font-size: 16px;
      line-height: 90%;
      color: $white;
    }
  }
}

.ad-banner {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 9;
  width: 100%;
  height: 70px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
