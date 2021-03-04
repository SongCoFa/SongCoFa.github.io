<template>
  <b-form-group :label="descript" :state="state">
    <BasicInput v-model="input" :state="state" v-bind="api" />
  </b-form-group>
</template>

<script>
import BasicInput from '@/components/InputTool/BasicInput/index.vue';

export default {
  name: 'VoucherEmployee',
  components: {
    BasicInput,
  },
  props: {
    defaultInput: String,
    required: Boolean,
  },
  data() {
    return {
      input: this.defaultInput,
      backendFieldName: 'emp_ID_name',
      descript: '員工編號/姓名',
      type: 'ValueTextSelection',
      content: [
        {
          text: '請選擇員工編號/姓名',
          value: null,
        },
      ],
    };
  },
  created() {
    this.getEmployee();
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
    getEmployee() {
      const api = `${process.env.VUE_APP_BASE_API}/api/driver/GetList`;
      const condition = {
        emp_ID: null,
        emp_name: null,
        dept: null,
      };

      this.$http.post(api, condition)
        .then((response) => {
          const data = response.data.Resource.filter(item => item.title === '駕駛長');

          const list = data.map((item) => {
            const temp = {};
            temp.text = `${item.emp_ID} / ${item.emp_name}`;
            temp.value = item.emp_name;
            return temp;
          });

          this.content.push(...list);
          console.log(list);
        })
        .catch(e => console.log(e));
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
