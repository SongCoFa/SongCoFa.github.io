<template>
  <b-form-group :label="descript" :state="state">
    <BasicInput v-model="input" :state="state" v-bind="api" />
  </b-form-group>
</template>

<script>
  import BasicInput from '@/components/InputTool/BasicInput/index.vue';

  export default {
    name: 'LeaveType',
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
        backendFieldName: 'leave_type',
        descript: '假別',
        type: 'Option',
        content: ['例假', '特別休假', '婚假', '喪假', '病假', '事假', '公假', '國定假日', '災防假', '休息日', '曠職', '陪產假'],
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
