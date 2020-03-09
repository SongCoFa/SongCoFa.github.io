<template>
  <div>
    <loading :active.sync="isLoading">
      <template slot="default">
        <div class="loading-image"></div>
      </template>
    </loading>
    <Banner></Banner>

    <!-- ABOUT US -->
    <section class="about-us container py-3 text-center">
      <h2 class="font-weight-bolder mb-3 pb-2">ABOUT US</h2>
      <p class="h4 pb-2">達·文西工房</p>
      <div class="row justify-content-center pb-3">
        <div class="col-10 col-lg-8">
          <p
            class="mb-0"
          >在修復特異點的旅程中，會遭遇各種魔獸和敵隊從者的襲擊，擊敗他們是繼續前行的唯一方式。達·文西工房為您提供各種冒險時所需的道具和英靈，有了這些補給，在執行任務時不管遭遇天災還是魔王的暗算，都能輕鬆克服挑戰。</p>
        </div>
      </div>
      <router-link to="/customer_product" class="text-shop text-decoration-none">進入商城</router-link>
    </section>

    <HomeYoutube></HomeYoutube>
    <!-- 看看其他人怎麼說 -->
    <section class="comment">
      <div class="container text-center">
        <h2 class="font-weight-bolder mb-4 pb-2">看看其他人怎麼說</h2>
        <div class="row">
          <div class="col-md-4">
            <div class="npc npc1 ml-auto mr-auto mb-3"></div>
            <div class="h5">上班族盛凱</div>
            <p
              class="mb-3 mb-md-0"
            >在我還沒發現 FGO Shop 之前，下班後總需要花大量的時間刷素材。多虧了這裡有各式各樣的材料與強力的禮裝，讓我順利打王不卡關。</p>
          </div>
          <div class="col-md-4">
            <div class="npc npc2 ml-auto mr-auto mb-3"></div>
            <div class="h5">大學生阿傑</div>
            <p
              class="mb-3 mb-md-0"
            >女友陪我一起玩Fate Grand Order，但是她平常手氣不好，所以總是召喚不到心儀的servant。購買 FGO Shop 的英靈後，她也能開心的跟我一起刷關卡養角色，不只提升了遊戲體驗，也讓我們之間的感情升溫呢。</p>
          </div>
          <div class="col-md-4">
            <div class="npc npc3 ml-auto mr-auto mb-3"></div>
            <div class="h5">高中生奈蘿</div>
            <p
              class="mb-3 mb-md-0"
            >每天下課回到家的第一件事就是玩FGO，可是我每次都打不過任務裡的 BOSS。但是自從我買了 FGO Shop 推薦的英靈和禮裝之後，打怪推王就像吃蛋糕一樣輕鬆呢！</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 熱銷商品 -->
    <section id="best-seller" class="pt-5 pb-4">
      <div class="container pb-5 text-center" animation-class="fadeInUpBig">
        <h2 class="font-weight-bolder mb-4 pb-2">最受歡迎的商品</h2>
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <swiper :options="swiperOption" ref="mySwiper" v-if="products.length > 0">
              <swiper-slide class="py-3" v-for="item in hotProducts" :key="item.id">
                <div class="card border h-100">
                  <div class="border-bottom">
                    <span class="badge float-right badge-danger">HOT</span>
                    <figure
                      class="mt-4 mb-4 item-image"
                      :style="{backgroundImage: `url(${item.imageUrl})`}"
                    ></figure>
                  </div>
                  <div class="card-body">
                    <h4 class="card-title text-center">
                      <a href="#" class="text-dark font-weight-bold">{{ item.title }}</a>
                    </h4>
                    <p class="card-text text-secondary text-center">{{ item.content }}</p>
                    <div class="d-flex justify-content-center align-items-end">
                      <div class="h5" v-if="!item.price">{{ item.origin_price | currency }}</div>
                      <del
                        class="h6 text-secondary pr-1"
                        v-if="item.price"
                      >{{ item.origin_price | currency }}</del>
                      <div
                        class="h5 text-maple font-weight-bold"
                        v-if="item.price"
                      >{{ item.price | currency }}</div>
                    </div>
                  </div>
                  <div class="card-footer d-flex bg-white border-0 pt-0 flex-md-column flex-xl-row">
                    <router-link
                      :to="`/customer_detail/${item.id}`"
                      class="btn btn-outline-secondary btn-xl-sm w-100 mr-2"
                    >查看更多</router-link>
                    <button
                      type="button"
                      class="btn btn-outline-fgo btn-xl-sm ml-auto w-100 mt-md-2 mt-xl-0"
                      @click="addToCart(item.id)"
                    >立即購買</button>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div class="swiper-pagination" slot="pagination"></div>
      </div>
    </section>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Banner from "../Banner";
import HomeYoutube from "../HomeYoutube";

export default {
  components: {
    swiper,
    swiperSlide,
    Banner,
    HomeYoutube
  },
  data() {
    return {
      swiperOption: {
        initialSlide: 0,
        direction: "horizontal",
        speed: 800,
        grabCursor: true,
        slidesPerView: 4,
        spaceBetween: 30,
        loop: true,
        autoplay: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          type: "bullets"
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        breakpoints: {
          // 當寬度小於等於 544
          544: {
            slidesPerView: 1
          },
          // 當寬度小於等於 767
          767: {
            slidesPerView: 2,
            centeredSlides: false
          },
          // 當寬度小於等於 991
          991: {
            slidesPerView: 3,
            centeredSlides: true
          }
        }
      },
      products: [],
      isLoading: false
    };
  },
  methods: {
    getProducts() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.products = response.data.products;
        vm.isLoading = false;
      });
    },
    addToCart(id, qty = 1) {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      vm.isLoading = true;
      const cart = {
        product_id: id,
        qty
      };
      vm.$http.post(api, { data: cart }).then(response => {
        if (response.data.message === "已加入購物車") {
          vm.$bus.$emit("message:push", "產品加入購物車成功", "success");
          vm.$bus.$emit("cartCreate:push");
          vm.isLoading = false;
        } else if (response.data.message === "加入購物車有誤") {
          vm.isLoading = false;
          vm.$bus.$emit("message:push", "Oops！出現錯誤了！", "danger");
        } else {
          vm.isLoading = false;
          vm.$bus.$emit("message:push", "Oops！出現錯誤了！", "danger");
        }
      });
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    hotProducts() {
      // 取得熱門商品
      const vm = this;
      return vm.products.filter(item => item.category === "熱銷商品");
    }
  },
  created() {
    this.getProducts();
  }
};
</script>

<style lang="scss">
.loading-image {
  background-image: url(https://media.giphy.com/media/f9S2zKoJ7gAcI030TO/giphy.gif);
  background-size: cover;
  width: 219px;
  height: 230px;
}
// ABOUT US
.about-us {
  h2 {
    display: inline-block;
    font-weight: 600;
    border-bottom: 3px solid #c1170c;
  }
  p {
    font-size: 20px;
  }
  .text-shop {
    border-radius: 5px;
    padding: 2px 4px 7px;
    text-align: center;
    font-size: 26px;
    background-color: rgb(3, 2, 66);
    color: #ffffff;
    transition: 0.3s;
    &.active,
    &:hover {
      background-color: rgb(81, 172, 20);
    }
  }
}
#best-seller {
  background-color: #e0dddd;
  padding-top: 50px;
  .container {
    position: relative;
    .btn-outline-fgo {
      border: 0.5px solid rgb(160, 3, 3);
      color: rgb(160, 3, 3);
      transition: 0.3s;
      &.active,
      &:hover {
        background-color: rgb(160, 3, 3);
        color: #ffffff;
      }
    }
    h2 {
      display: inline-block;
      font-weight: 60;
      border-bottom: 3px solid #c1170c;
    }
    .swiper-slide {
      height: auto;
      .card {
        box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.16);
        .badge {
          font-size: 14px;
          padding: 5px 8px;
          margin-right: 4px;
          margin-top: 4px;
        }
        figure.item-image {
          height: 120px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          @media (max-width: 576px) {
            height: 100px;
          }
        }
        .card-text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .btn-xl-sm {
          @media (min-width: 1200px) {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
            line-height: 1.5;
            border-radius: 0.2rem;
            font-size: 16px;
          }
        }
      }
    }
    .swiper-pagination {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      .swiper-pagination-bullet {
        width: 16px;
        height: 16px;
        background-color: #0c79c1;
        margin-left: 8px;
        margin-right: 8px;
      }
    }
  }
}
.comment {
  background-color: #929191;
  padding: 50px 0 50px;
  h2 {
    display: inline-block;
    font-weight: 600;
    border-bottom: 3px solid #c1170c;
  }
  .npc {
    background: #f8f9fa;
    border-radius: 50%;
    width: 200px;
    height: 200px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .npc1 {
    background-image: url(../../assets/images/npc/npc1.png);
  }
  .npc2 {
    background-image: url(../../assets/images/npc/npc2.png);
  }
  .npc3 {
    background-image: url(../../assets/images/npc/npc3.png);
  }
  .row .btn {
    position: relative;
    transform: translateY(50%);
    z-index: 9;
    font-size: 24px;
    @media (max-width: 767px) {
      font-size: 20px;
    }
  }
}
</style>