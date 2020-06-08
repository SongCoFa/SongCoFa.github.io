<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-4" v-if="orders.length">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th>應付金額</th>
          <th>是否付款</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in sortOrder" :key="item.id" :class="{'text-secondary': !item.is_paid}">
          <td>{{ item.create_at | date }}</td>
          <td>
            <span v-text="item.user.email" v-if="item.user"></span>
          </td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total | currency }}</td>
          <td>
            <span v-if="item.is_paid" class="text-success">已付款</span>
            <span v-else class="text-danger">尚未付款</span>
          </td>
          <td>
            <!-- <button class="btn btn-outline-primary btn-sm" @click="openDelModal(item)">刪除</button> -->
            <button class="btn btn-outline-primary btn-sm" @click="openModal(item)">編輯</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 分頁 -->
    <Pagination :pagination="pagination" @emitPage="getOrders"></Pagination>

    <!-- 修改表單 -->
    <div
      class="modal fade"
      id="orderModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">

          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增訂單</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label for="useremail">Email</label>
          <input
            type="email"
            class="form-control"
            name="email"
            id="useremail"
            :class="{'is-invalid': errors.has('email')}"
            v-validate="'required'"
            v-model="tempOrder.email"
            placeholder="請輸入 Email"
          />
          <span class="text-danger" v-if="errors.has('email')">請輸入信箱</span>
            </div>

            <div class="form-group">
              <label for="username">收件人姓名</label>
          <input
            type="text"
            class="form-control"
            name="name"
            id="username"
            :class="{'is-invalid': errors.has('name')}"
            v-model="tempOrder.name"
            v-validate="'required'"
            placeholder="輸入姓名"
          />
          <span class="text-danger" v-if="errors.has('name')">請輸入姓名</span>
            </div>

            <div class="form-group">
              <label for="usertel">收件人電話</label>
          <input
            type="tel"
            class="form-control"
            name="tel"
            id="usertel"
            :class="{'is-invalid': errors.has('tel')}"
            v-model="tempOrder.tel"
            v-validate="'required'"
            placeholder="請輸入電話"
          />
          <span class="text-danger" v-if="errors.has('tel')">請輸入電話</span>
            </div>

            <div class="form-group">
              <label for="useraddress">收件人地址</label>
          <input
            type="text"
            class="form-control"
            name="address"
            id="useraddress"
            :class="{'is-invalid': errors.has('address')}"
            v-model="tempOrder.address"
            v-validate="'required'"
            placeholder="請輸入地址"
          />
          <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
            </div>

            <div class="form-group">
              <label for="comment">留言</label>
          <textarea
            name
            id="comment"
            class="form-control"
            cols="30"
            rows="10"
            v-model="tempOrder.message"
          ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <!-- <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Pagination from "../Pagination";

export default {
  data() {
    return {
      orders: [],
      tempOrder: {
        user:{
          name:{},
        },
      },
      pagination: {},
      isLoading: false,
    };
  },
  components: {
    Pagination
  },
  methods: {
    getOrders(Page = 1) {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/orders?page=${Page}`;
       vm.isLoading = true;
      vm.$http.get(api).then(response => {
        vm.isLoading = false;
        vm.orders = response.data.orders;
        vm.pagination = response.data.pagination;
      });
    },
    openModal(item) {
      this.tempOrder = Object.assign({}, item);
      $("#orderModal").modal("show");
    },
  },
  computed: {
    sortOrder() {
      const vm = this;
      let newOrder = [];
      if (vm.orders.length) {
        newOrder = vm.orders.sort((a, b) => {
          const aIsPaid = a.is_paid ? 1 : 0;
          const bIsPaid = b.is_paid ? 1 : 0;
          return bIsPaid - aIsPaid;
        });
      }
      return newOrder;
    }
  },
  created() {
    this.getOrders();
  }
};
</script>