<template>
  <b-form-group :label="descript" :state="state">
    <BasicInput v-model="input" :state="state" v-bind="api" />
  </b-form-group>
</template>

<script>
import BasicInput from '@/components/InputTool/BasicInput/index.vue';

export default {
  name: 'RoutePrefix',
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
      backendFieldName: 'RoutePrefix',
      descript: '路線種類',
      type: 'Option',
      content: {
        市公車: '市公車',
        國道: '國道',
        專車或自訂路線: '專車或自訂路線',
      },
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
};
</script>

<style lang="scss" scoped>
</style>
