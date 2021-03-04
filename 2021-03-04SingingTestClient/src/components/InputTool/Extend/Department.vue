<template>
  <b-form-group :label="descript" :state="state">
    <BasicInput v-model="input" :state="state" v-bind="api" />
  </b-form-group>
</template>

<script>
import BasicInput from '@/components/InputTool/BasicInput/index.vue';

export default {
  name: 'Department',
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
      backendFieldName: 'dept',
      descript: '員工部門',
      type: 'Option',
      content: ['班車', '契約', '遊覽車'],
    };
  },
  beforeCreate() {
    // this.$http
    //   .post(`${process.env.VUE_APP_BASE_API}/api/basic-data/GetDeptList`) // can refactor by get data from vuex store
    //   .then((response) => {
    //     console.log(response.data);
    //     this.content = response.data.Resource;
    //   })
    //   .catch(e => console.log(e));
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
