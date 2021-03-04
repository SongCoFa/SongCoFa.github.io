<template>
  <b-form-group :label="descript" :state="state">
    <BasicInput v-model="input" :state="state" v-bind="api" />
  </b-form-group>
</template>

<script>
import BasicInput from '@/components/InputTool/BasicInput/index.vue';

export default {
  name: 'VoucherDirection',
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
      backendFieldName: 'Direction',
      descript: '方向',
      type: 'Boolean',
      content: {
        去程: 'false',
        返程: 'true',
      },
    };
  },
  watch: {
    input(value) {
      let temp = value;
      if (temp === 'false') {
        temp = false;
      } else if (temp === 'true') {
        temp = true;
      } else {
        temp = null;
      }

      const send = {
        componentName: this.$options.name,
        backendFieldName: this.backendFieldName,
        value: temp,
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
};
</script>

<style lang="scss" scoped>
</style>
