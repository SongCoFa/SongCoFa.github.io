<template>
  <div class="bg-light container-border p-3">
    <b-row>
      <b-col cols="6">
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          label="行駛日期："
          label-for="date"
          class="m-0 col-12"
        >
          <b-form-input id="date" class="form-control" type="date" v-model="date"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col class="text-right">
        <b-button variant="primary" class="mx-1 rounded-0" @click="GetResult(selectedInput);clearSelectedEmployee()">查詢</b-button>
        <Add v-if="AddListFormat" :AddListFormat="AddListFormat" :AddApi="AddApi" :writable="writable" @refreshData="refreshData" class="d-inline-block"/>
        <b-button variant="danger" class="mx-1 rounded-0" @click="checkValidData" :disabled="!writable">檢查</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Add from '@/components/table/Modals/Add.vue';

export default {
  name: 'ScheduleQuery',
  components: {
    Add,
  },
  props: {
    GetResultApi: String,
    AddListFormat: Array,
    AddApi: String,
    writable: Boolean,
  },
  data() {
    return {
      selectedInput: {},
      date: this.$moment().format('YYYY-MM-DD'),
    };
  },
  watch: {
    date(value) {
      const send = {
        backendFieldName: 'voucher_date',
        value,
      };
      this.setInput(send);
    },
  },
  created() {
  },
  mounted() {
    const today = this.$moment().format('YYYY-MM-DD');
    this.date = today;
    this.selectedInput = { voucher_date: today };
  },
  methods: {
    async GetResult(input) {
      const search = {
        start_date: input.voucher_date,
        end_date: input.voucher_date,
      };

      const result = await this.$http.post(this.GetResultApi, search)
        .then((response) => {
          console.log(response);
          return response.data.Resource;
        })
        .catch(e => console.log(e));

      this.$emit(
        'updateResult',
        result,
        Object.assign({}, this.selectedInput),
        new Date(),
      );

      if (result.length === 0) {
        alert('查無資料');
      }
    },
    setInput({ backendFieldName, value }) {
      this.$set(this.selectedInput, backendFieldName, value);
    },
    checkValidData() {
      this.$emit('checkValidData');
    },
    refreshData() {
      this.$emit('refreshData');
    },
    clearSelectedEmployee() {
      this.$emit('clearSelectedEmployee');
    },
  },
};
</script>

<style lang="scss" scoped>
.container-border {
  border: 1px solid #aaaaaa;
}
</style>
