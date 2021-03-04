<template>
  <b-form-group :label="descript" :state="state">
    <BasicInput v-model="input" :state="state" v-bind="api" />
  </b-form-group>
</template>

<script>
import BasicInput from '@/components/InputTool/BasicInput/index.vue';

export default {
  name: 'Month',
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
      backendFieldName: 'month',
      descript: '月份',
      type: 'NonNullOption',
      content: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
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
  created() {
    const send = {
      componentName: this.$options.name,
      backendFieldName: this.backendFieldName,
      value: this.input,
      state: this.state,
    };
    this.$emit('updateInput', send);
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
};
</script>

<style lang="scss" scoped>
</style>
