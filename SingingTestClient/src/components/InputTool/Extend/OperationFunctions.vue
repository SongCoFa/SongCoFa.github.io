<template>
  <b-form-group :label="descript" :state="state">
    <BasicInput v-model="input" :state="state" v-bind="api" />
  </b-form-group>
</template>

<script>
import BasicInput from '@/components/InputTool/BasicInput/index.vue';

export default {
  name: 'OperationFunctions',
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
      backendFieldName: 'item',
      descript: '操作功能項目',
      type: 'Option',
      content: null,
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
  beforeCreate() {
    this.$http
      .post(`${process.env.VUE_APP_BASE_API}/api/basic-data/GetFunctionList`)
      .then((response) => {
        const result = JSON.parse(response.data.Resource);
        this.content = result.reverse().map(item => item.function_name);
      })
      .catch(e => console.log(e));
  },
};
</script>

<style lang="scss" scoped>
</style>
