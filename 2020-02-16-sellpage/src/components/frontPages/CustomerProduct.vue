<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <!-- Banner -->
    <div class="banner"></div>
    <!-- Main Content -->
    <div class="category container pt-3 pb-5">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-white">
          <li class="breadcrumb-item">
            <router-link to="/customer_home" class="text-decoration-none">首頁</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            <span v-if="tempCategory==''">所有商品</span>
            <span v-else>{{ tempCategory }}</span>
          </li>
        </ol>
      </nav>
      <div class="row">
        <!-- 商品類別 -->
        <section class="col-12 col-lg-3">
          <div class="d-flex d-lg-block flex-wrap justify-content-between sticky-list">
            <a
              href="#"
              class="sb1 btn category-btn d-md-flex justify-content-center align-items-center p-4"
              @click.prevent="tempCategory = ''"
              :class="{'active': tempCategory === ''}"
            >
              <div class="row no-gutters">
                <div class="col-md-12 align-self-center text-center text-md-right">
                  <p>所有商品</p>
                </div>
              </div>              
            </a>
            <a
              href="#"
              class="sb2 btn category-btn d-md-flex justify-content-center align-items-center p-4"
              @click.prevent="tempCategory = '熱銷商品'"
              :class="{'active': tempCategory === '熱銷商品'}"
            >
              <div class="row no-gutters">
                <div class="col-md-12 align-self-center text-center text-md-right">
                  <p>熱銷商品</p>
                </div>
              </div>
            </a>
            <a
              href="#"
              class="sb3 btn category-btn d-md-flex justify-content-center align-items-center p-4"
              @click.prevent="tempCategory = '最新商品'"
              :class="{'active': tempCategory === '最新商品'}"
            >
              <div class="row no-gutters">
                <div class="col-md-12 align-self-center text-center text-md-right">
                  <p>最新商品</p>
                </div>
              </div>
            </a>
            <a
              href="#"
              class="sb4 btn category-btn d-md-flex justify-content-center align-items-center p-4"
              @click.prevent="tempCategory = '英靈從者'"
              :class="{'active': tempCategory === '英靈從者'}"
            >
              <div class="row no-gutters">
                <div class="col-md-12 align-self-center text-center text-md-right">
                  <p>英靈從者</p>
                </div>
              </div>
            </a>
            <a
              href="#"
              class="sb5 btn category-btn d-md-flex justify-content-center align-items-center p-4"
              @click.prevent="tempCategory = '概念禮裝'"
              :class="{'active': tempCategory === '概念禮裝'}"
            >
              <div class="row no-gutters">
                <div class="col-md-12 align-self-center text-center text-md-right">
                  <p>概念禮裝</p>
                </div>
              </div>
            </a>
            <a
              href="#"
              class="sb6 btn category-btn d-md-flex justify-content-center align-items-center p-4"
              @click.prevent="tempCategory = '素材道具'"
              :class="{'active': tempCategory === '素材道具'}"
            >
              <div class="row no-gutters">
                <div class="col-md-12 align-self-center text-center text-md-right">
                  <p>素材道具</p>
                </div>
              </div>
            </a>
          </div>
        </section>
        <!-- 商品列表 -->
        <section class="col-12 col-lg-9">
          <h3 v-if="tempCategory" class="py-2 py-lg-0">{{ tempCategory }}</h3>
          <h3 v-else class="py-2 py-lg-0">所有商品</h3>
          <div class="row mt-3">
            <article class="col-md-6 col-lg-4 mb-4" v-for="item in activeProducts" :key="item.id">
              <div class="card border h-100">
                <div class="border-bottom">
                  <!-- 依條件判斷，只會出現其中一個 badge -->
                  <span
                    class="badge float-right badge-danger"
                    v-if="item.category === '熱銷商品'"
                  >{{ item.category }}</span>
                  <span
                    class="badge float-right badge-primary"
                    v-if="item.category === '最新商品'"
                  >{{ item.category }}</span>
                  <span
                    class="badge float-right badge-dark"
                    v-if="item.category === '英靈從者'"
                  >{{ item.category }}</span>
                  <span
                    class="badge float-right badge-dark"
                    v-if="item.category === '概念禮裝'"
                  >{{ item.category }}</span>
                  <span
                    class="badge float-right badge-dark"
                    v-if="item.category === '素材道具'"
                  >{{ item.category }}</span>
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
                    <!-- 前者顯示僅有原價的 -->
                    <div class="h5" v-if="!item.price">{{ item.origin_price | currency }}</div>
                    <!-- 後者顯示有原價 + 優惠價的 -->
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
                <div class="card-footer d-flex bg-white border-0 pt-0 flex-lg-column flex-xl-row">
                  <!-- 使用 :to 來做動態路徑 -->
                  <router-link
                    :to="`/customer_detail/${item.id}`"
                    class="btn btn-outline-secondary btn-xl-sm w-100 mr-2"
                  >查看更多</router-link>
                  <!-- 直接點加入購物車，就是 + 預設值 1 (後面沒寫第二個參數) -->
                  <button
                    type="button"
                    class="btn btn-outline-fgo btn-xl-sm ml-auto w-100 mt-lg-2 mt-xl-0"
                    @click="addtoCart(item.id)"
                  >                    
                    加入購物車
                  </button>
                </div>
              </div>
            </article>
          </div>
          <!-- 分頁 -->
          <Pagination :pagination="pagination" @emitPage="getAllProducts" v-if="tempCategory===''"></Pagination>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "../Pagination";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      products: [],
      product: {},
      isLoading: false,
      tempCategory: '',
      pagination: {},
      allProducts: [], 
    };
  },
  methods: {
    getAllProducts(page = 1) {
      // 有頁碼 (所有商品)
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.allProducts = response.data.products;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;
      });
    },
    getProducts() {
      // 沒頁碼 (其他類別)
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`; // 取得商品列表_all
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.products = response.data.products;
        vm.isLoading = false;
      });
    },
    addtoCart(id, qty = 1) {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      vm.isLoading = true;
      const cart = {
        product_id: id,
        qty,
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
    },
    goDetail(id) {
      const path = `/customer_detail/${id}`;
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
  },
  computed: {
    activeProducts() {
      const vm = this;
      if (vm.tempCategory === '') { return vm.allProducts; }
      return vm.products.filter((item) =>  vm.tempCategory === item.category);
    },
  },
  created() {
    this.getAllProducts(); // 所有商品
    this.getProducts(); // 其他類別
  }
};
</script>

<style lang="scss" scoped>

.banner {
  background-image: url(../../assets/images/Banner/CustomerProduct.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center 26%;
  height: 30vh; // 以裝置 (螢幕視窗) 大小為基準
  @media (min-width: 992px) {
    height: 50vh;
  }
}
.category {
  .sticky-list {
    @media (min-width: 992px) {
      position: sticky !important;
      top: 93px;
    } 
  }
  .category-btn {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 5px;
    border: 0.5px solid #ccc;
    margin-bottom: 2%;
    transition: all 0.5s;
    flex-wrap: nowrap;
    @media (max-width: 366px) {
      width: 49%; // 兩欄
    }
    @media (min-width: 367px) and (max-width: 991px) {
      width: 32%; // 三欄
    }
    p {    
      margin:0px;
      font-weight: bold;
      @media (min-width: 767px) {
        padding-left: 20px;
      }
    }
    &:hover {
      border: 0.5px solid #c1170c;
      box-shadow: 0 1px 5px #c1170c;
    }
    &.active {
      border: 0.5px solid #c1170c;
      box-shadow: 0 2px 10px #c1170c;
    }
    
  }
  .sb1{background-image: url(../../assets/images/Sidebar/sidebar01.png);}
  .sb2{background-image: url(../../assets/images/Sidebar/sidebar02.png);}
  .sb3{background-image: url(../../assets/images/Sidebar/sidebar03.png);}
  .sb4{background-image: url(../../assets/images/Sidebar/sidebar04.png);}
  .sb5{background-image: url(../../assets/images/Sidebar/sidebar05.png);}
  .sb6{background-image: url(../../assets/images/Sidebar/sidebar06.png);}
  .card {
    transition: all 0.5s;
    box-shadow: 0 1px 3px #000;
    &:hover {
      box-shadow: 0 2px 10px #000;
    }
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
    .btn-outline-fgo{
      border: 0.5px solid rgb(160, 3, 3);
      color:  rgb(160, 3, 3);
      transition: 0.3s;
      &.active,
      &:hover {
        background-color:  rgb(160, 3, 3);
        color: #ffffff;
      }
    }
  }
}
</style>