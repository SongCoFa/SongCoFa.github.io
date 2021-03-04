<template>
  <b-form-group :label="descript" :state="state">
    <BasicInput v-model="input" :state="state" v-bind="api" />
  </b-form-group>
</template>

<script>
  import BasicInput from '@/components/InputTool/BasicInput/index.vue';

  export default {
    name: 'SpecialStartDate',
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
        backendFieldName: 'special_start_date',
        descript: '特殊起始日期',
        type: 'Date',
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
  };
</script>

<style lang="scss" scoped>
</style>
