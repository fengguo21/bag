<template>
  <swiper :options="swiperOption">
    <!-- 这部分放你要渲染的那些内容 -->
    <swiper-slide v-for="item in imgitems">
      <div v-if="item.external_link">
        <a :href="item.external_link">
          <img :src="item.image_url">
        </a>
      </div>
      <div v-else>
        <div v-if="item.campaign_id">
         <router-link :to="{path:'/eventdetail/'+item.campaign_id}">
            <img :src="item.image_url">
          </router-link>
        </div>
        <div v-else>
            <img :src="item.image_url">
        </div>
      </div>
    </swiper-slide>
    <!-- 这是轮播的小圆点 -->
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>
<script>
  import Vue from 'vue'
  import {
    swiper,
    swiperSlide
  } from 'vue-awesome-swiper'
  export default {
    name: 'banner',
    props: {
      imgitems: {
        type: Array
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    data() {
      return {
        swiperOption: {
          autoplay: true,
          autoplay: {
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
          },
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 0
        },
      }
    }
  }

</script>
<style scoped>
  html,
  body {
    width: 100%;
  }

  .swiper-container {
    width: 100%;
  }

  .swiper-container img {
    width: 100%;
    height: auto;
  }

</style>
