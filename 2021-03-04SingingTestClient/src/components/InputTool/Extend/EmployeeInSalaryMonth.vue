<!-- 薪資月的員工清單 -->
<template>
  <b-form-group :label="descript" :state="state">
    <b-form-select
      class="form-control"
      v-model="input"
      :options="content"
      value-field="value"
      text-field="text"
      :state="state"
    >
    </b-form-select>
  </b-form-group>
</template>

<script>
export default {
  name: 'EmployeeInSalaryMonth',
  components: {
  },
  props: {
    defaultInput: String,
    required: Boolean,
    selectedInput: Object,
  },
  data() {
    return {
      input: this.defaultInput,
      backendFieldName: 'emp_ID_name',
      descript: '員工編號/姓名',
      type: 'ValueTextSelection',
      content: [
        {
          text: '請選擇駕駛',
          value: null,
        },
      ],
    };
  },
  watch: {
    input(value) {
      const send = {
        componentName: this.$options.name,
        backendFieldName: this.backendFieldName,
        value,
        state: this.state,
      };
      this.$emit('updateInput', send);
    },
    selectedInput: {
      handler() {
        this.getList();
      },
      deep: true,
    },
  },
  created() {
    this.getList();
  },
  computed: {
    state() {
     return this.required ? !!this.input : null;
    },
    api() {
      return {
        descript: this.descript,
        type: this.type,
        content: this.content,
      };
    },
  },
  methods: {
    getList() {
      const api = `${process.env.VUE_APP_BASE_API}/api/driver/GetList`;
      const condition = {
        emp_ID: null,
        emp_name: null,
        dept: null,
        expired: 0,
      };

      this.content = [
        {
          text: '請選擇駕駛',
          value: null,
        },
      ];

      this.$http.post(api, condition)
        .then((response) => {
          // 篩選包含已離職，且查詢月大於等於離職日
          const result = response.data.Resource.filter((item) => {
            const expireDate = item.expire_date;
            const compareDate = `${this.$parent.$parent.selectedInput.year}-${this.$parent.$parent.selectedInput.month}-01`;
            // console.log(compareDate);
            let check = false;

            if (expireDate) {
              check = this.$moment(expireDate).isBefore(compareDate, 'month');
            }

            // console.log(check);

            // title:駕駛長 且 離職月小於等於查詢月
            return item.title === '駕駛長' && check === false;
          });

          const list = result.map((item) => {
            const temp = {};
            temp.text = `${item.emp_ID} / ${item.emp_name}`;
            temp.value = item.emp_name;
            return temp;
          });

          this.content.push(...list);

          // console.log(this.content);

          if (response.data.Message === '成功') {
            this.defaultValue();
          }
        })
        .catch(error => console.log(error));
    },
    defaultValue() {
      const send = {
          componentName: this.$options.name,
          backendFieldName: this.backendFieldName,
          value: this.input,
          state: this.state,
        };

        this.$emit('updateInput', send);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
