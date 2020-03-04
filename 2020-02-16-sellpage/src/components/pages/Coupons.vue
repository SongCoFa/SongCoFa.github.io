<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <!-- Button trigger modal -->
      <button class="btn btn-primary" @click="openModal(true)">建立新優惠券</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>優惠碼</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.code }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ item.due_date | date}}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-danger">未啟用</span>
          </td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button class="btn btn-sm btn-outline-primary" @click="openModal(false, item)">編輯</button>
              <button class="btn btn-sm btn-outline-danger" @click="openDelModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 分頁 -->
    <Pagination :pagination="pagination" @emitPage="getCoupons"></Pagination>
    <!-- 新增/修改 Modal -->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">              
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">優惠券名稱</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="tempCoupon.title"
                    placeholder="請輸入優惠券名稱"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="percent">折扣百分比</label>
                    <input
                      type="number"
                      class="form-control"
                      id="percent"
                      v-model="tempCoupon.percent"
                      placeholder="請輸入折扣百分比"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="dueDate">到期日</label>
                    <input type="date" class="form-control" id="dueDate" v-model="due_date" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="couponCode">優惠碼</label>
                  <input
                    type="text"
                    class="form-control"
                    id="couponCode"
                    v-model="tempCoupon.code"
                    placeholder="請輸入優惠碼"
                  />
                </div>

                <hr />

                <div class="form-group">
                  <label for="description">活動辦法</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    v-model="tempCoupon.description"
                    placeholder="請輸入活動折扣辦法"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">活動文案</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    v-model="tempCoupon.content"
                    placeholder="請輸入活動文案內容"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :true-value="1"
                      :false-value="0"
                      v-model="tempCoupon.is_enabled"
                      id="is_enabled"
                    />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 刪除 Modal" -->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠券？（刪除後將無法恢復）
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon">確認刪除</button>
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
      coupons: [],
      tempCoupon: {},
      pagination: {},
      isNew: false,
      isLoading: false,
      due_date: new Date(),
      status: {
        fileUploading: false
      },
    };
  },
  components: {
    Pagination
  },
  watch: {
    due_date() {
      const vm = this;
      const timestamp = Math.floor(new Date(vm.due_date) / 1000);
      vm.tempCoupon.due_date = timestamp;
    }
  },
  methods: {
    getCoupons(page = 1) {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons?page=${page}`;
      vm.isLoading = true;
      vm.$http.get(api).then(response => {
        vm.isLoading = false;
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
      });
    },
    openModal(isNew, item) {
      const vm = this;
      if (isNew) {
        vm.due_date = new Date();
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item);
        this.isNew = false;
        const dateAndTime = new Date(vm.tempCoupon.due_date * 1000)
          .toISOString()
          .split("T");
        vm.due_date = dateAndTime[0];
      }
      $("#couponModal").modal("show");
    },
    updateCoupon() {
      let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`;
      const vm = this;
      let httpMethod = "post";
      if (!vm.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = "put";
      }

      vm.$http[httpMethod](api, { data: vm.tempCoupon }).then(response => {
        if (response.data.success) {
          $("#couponModal").modal("hide");
          vm.getCoupons();
        } else {
          $("#couponModal").modal("hide");
          vm.getCoupons();
          console.log("新增失敗");
        }
      });
    },
    openDelModal(item) {
      this.tempCoupon = item;
      $("#delCouponModal").modal("show");
    },
    deleteCoupon() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;

      vm.$http.delete(api).then(response => {
        if (response.data.success) {
          $("#delCouponModal").modal("hide");
          vm.getCoupons();
        } else {
          $("#delCouponModal").modal("hide");
          vm.getCoupons();
          console.log("刪除失敗");
        }
      });
    },
    uploadFile() {
      const uploadedFile = this.$refs.files.files[0];
      const vm = this;
      const formData = new FormData();
      formData.append("file-to-upload", uploadedFile);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/upload`;
      vm.status.fileUploading = true;
      vm.$http
        .post(api, formData, {
          headers: {
            "Content-type": "multipart/form-data"
          }
        })
        .then(response => {
          vm.status.fileUploading = false;
          if (response.data.success) {
            vm.$set(vm.tempCoupon, "imageUrl", response.data.imageUrl);
          } else {
            vm.$bus.$emit("message:push", response.data.message, "danger");
          }
        });
    }
  },
  created() {
    this.getCoupons();
  }
};
</script>