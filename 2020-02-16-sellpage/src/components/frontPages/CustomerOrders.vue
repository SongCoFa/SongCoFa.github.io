<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <!-- 購物車內容 -->
    <div class="container pt-5 pb-4 cart">
      <div class="text-center">
        <h2 class="font-weight-bold mb-4 pb-2">購物車內容</h2>
      </div>
      <div class="row d-flex justify-content-center" v-if="cart.carts.length !== 0">
        <div class="col-lg-10">
          <table class="table">
            <thead class="thead-light">
              <th>取消</th>
              <th>商品名稱</th>
              <th>數量</th>
              <th>單價</th>
            </thead>
            <tbody>
              <tr v-for="item in cart.carts" :key="item.id">
                <td class="align-middle">
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="removeCartItem(item.id)"
                  >
                    <i class="far fa-trash-alt"></i>
                  </button>
                </td>
                <td class="align-middle">
                  {{ item.product.title }}
                  <div class="text-success" v-if="item.coupon">已套用優惠券</div>
                </td>
                <td class="align-middle">
                      <div class="input-group">
                        <button class="btn btn-outlinebtn-fgo btn-sm d-none d-sm-block mr-2"
                        @click="minusQty(item.id, item.product.id, item.qty)">
                          <i class="fas fa-minus"></i>
                        </button>
                        <select class="select-text-center form-control border-moderate"
                        id="qtySelect" v-model="item.qty"
                        @change="updateQty(item.id, item.product.id, item.qty)">
                          <option selected disabled>{{ item.qty }}</option>
                          <option :value="number" v-for="number in 10" :key="number">
                            {{ number }}
                          </option>
                        </select>
                        <button class="btn btn-outlinebtn-fgo btn-sm d-none d-sm-block ml-2"
                        @click="addQty(item.id, item.product.id, item.qty)">
                          <i class="fas fa-plus"></i>
                        </button>
                      </div>
                    </td>                
                <td class="align-middle text-right">{{ item.final_total | currency }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right">總金額</td>
                <td class="text-right">{{ cart.total | currency }}</td>
              </tr>
              <!-- 如果沒套用折扣，就不用顯示折扣價 -->
              <tr v-if="cart.total !== cart.final_total">
                <td colspan="3" class="text-right text-success">折扣價</td>
                <td class="text-right text-success">{{ cart.final_total | currency }}</td>
              </tr>
            </tfoot>
          </table>
          <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code" />
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">套用優惠碼</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-12" v-else>
        <div class="empty-cart text-center">
          <p class="mb-1">購物車沒有東西哦！快去逛逛吧！</p>
          <router-link to="/customer_product" class="text-decoration-none">進入商城</router-link>
        </div>
      </div>
    </div>

    <!-- 訂單資訊 -->
    <div class="container cart-form pb-5">
      <div class="text-center">
        <h2 class="font-weight-bold mb-4 pb-2">購買資訊</h2>
      </div>
      <div class="row justify-content-center">
        <form class="col-lg-10" @submit.prevent="createOrder">
          <div class="form-group">
            <label for="useremail">
              <i class="fas fa-envelope"></i>
              Email
            </label>
            <input
              type="email"
              class="form-control"
              name="email"
              id="useremail"
              :class="{'is-invalid': errors.has('email')}"
              v-validate="'required|email'"
              v-model="form.user.email"
              placeholder="請輸入 Email"
            />
            <span class="text-danger" v-if="errors.has('email')">{{errors.first('email')}}</span>
          </div>

          <div class="form-group">
            <label for="username">
              <i class="fas fa-user"></i>
              收件人姓名
            </label>
            <input
              type="text"
              class="form-control"
              name="name"
              id="username"
              :class="{'is-invalid': errors.has('name')}"
              v-model="form.user.name"
              v-validate="'required'"
              placeholder="輸入姓名"
            />
            <span class="text-danger" v-if="errors.has('name')">請輸入姓名</span>
          </div>

          <div class="form-group">
            <label for="usertel">
              <i class="fas fa-phone"></i>
              收件人電話
            </label>
            <input
              type="tel"
              class="form-control"
              name="tel"
              id="usertel"
              :class="{'is-invalid': errors.has('tel')}"
              v-model="form.user.tel"
              v-validate="'required'"
              placeholder="請輸入電話"
            />
            <span class="text-danger" v-if="errors.has('tel')">請輸入電話</span>
          </div>

          <div class="form-group">
            <label for="useraddress">
              <i class="fas fa-map-marker-alt"></i>
              收件人地址
            </label>
            <input
              type="text"
              class="form-control"
              name="address"
              id="useraddress"
              :class="{'is-invalid': errors.has('address')}"
              v-model="form.user.address"
              v-validate="'required'"
              placeholder="請輸入地址"
            />
            <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
          </div>

          <div class="form-group">
            <label for="comment">
              <i class="fas fa-comment-dots"></i>
              留言
            </label>
            <textarea
              name
              id="comment"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>
          <div class="text-right">
            <button class="btn btn-danger">送出訂單</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "CustomerOrders",
  data() {
    return {
      products: [],
      product: {},
      pagination: {},
      status: {
        loadingItem: ""
      },
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      },
      cart: {
        carts: []
      },
      order: {},
      coupon_code: "",
      isLoading: false
    };
  },
  methods: {
    getCart() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      vm.isLoading = true;
      vm.$http.get(api).then(response => {
        vm.cart = response.data.data;
        vm.isLoading = false;
      });
    },
    removeCartItem(id) {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      vm.$http.delete(api).then(response => {
        if (response.data.success) {
          vm.$bus.$emit("message:push", "產品刪除成功", "success");
          vm.isLoading = false;
          vm.getCart();
          vm.$bus.$emit("cartCreate:push");
        } else {
          vm.isLoading = false;
          vm.$bus.$emit("message:push", "Oops！出現錯誤了！", "danger");
        }
      });
    },
    addCouponCode() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
      const coupon = {
        code: vm.coupon_code
      };
      vm.isLoading = true;
      vm.$http.post(api, { data: coupon }).then(response => {
        if (response.data.success) {
          vm.isLoading = false;
          vm.$bus.$emit("message:push", "優惠碼套用成功", "success");
          vm.getCart();
          vm.$bus.$emit("cartCreate:push");
        } else if (response.data.message === "找不到優惠券!") {
          vm.isLoading = false;
          vm.$bus.$emit("message:push", "沒有這張優惠卷", "danger");
        } else if (response.data.message === "優惠券無法無法使用或已過期") {
          vm.isLoading = false;
          vm.$bus.$emit("message:push", "優惠券無法無法使用或已過期", "danger");
        }
      });
    },
    createOrder() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;
      const order = vm.form;
      vm.isLoading = true;
      vm.$validator.validate().then(result => {
        if (result) {
          vm.$http.post(api, { data: order }).then(response => {
            if (response.data.success) {
              vm.$router.push(`/customer_checkout/${response.data.orderId}`);
            }
            vm.isLoading = false;
          });
        } else {
          vm.isLoading = false;
        }
      });
    },
    addQty(cid, pid, qty) {
      const newQTY = qty + 1;
      this.updateQty(cid, pid, newQTY);
    },
    minusQty(cid, pid, qty) {
      const newQTY = qty - 1;
      this.updateQty(cid, pid, newQTY);
    },
    updateQty(cid, pid, qty) {
      if (qty <= 0) {
        return;
      }
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      vm.isLoading = true;
      const cart = {
        product_id: pid,
        qty,
      };
      vm.$http.post(api, { data: cart });
      const url2 = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${cid}`;
      vm.$http.delete(url2).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('message:push', '產品數量已更新', 'success');
          vm.getCart();
          vm.$bus.$emit('cartCreate:push');
          vm.isLoading = false;
        } else {
          vm.$bus.$emit('message:push', 'Oops！出現錯誤了！', 'danger');
          vm.isLoading = false;
        }
      });
    },
  },
  created() {
    const vm = this;
    vm.getCart();
    vm.$bus.$on('cartCreate:push', () => {
      vm.getCart();
    })
  }
};
</script>

<style scope lang="scss">
.cart {
  h2 {
    display: inline-block;
    font-weight: 600;
    border-bottom: 3px solid #c1170c;
  }
  .empty-cart {
    background-color: #ededed;
    border-radius: 10px;
    padding: 30px 0px;
  }
}
.cart-form {
  h2 {
    display: inline-block;
    font-weight: 600;
    border-bottom: 3px solid #c1170c;
  }
}
.btn-outlinebtn-fgo{
      border: 0.5px solid rgb(51, 55, 73);
      color:  rgb(51, 55, 73);
      transition: 0.3s;
      &.active,
      &:hover {
        background-color:  rgb(51, 55, 73);
        color: #ffffff;
      }
    }
</style>