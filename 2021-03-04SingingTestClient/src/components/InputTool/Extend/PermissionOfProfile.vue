<template>
  <b-form-group :label="descript">
    <b-form-select v-model="input" :options="content" :state="state"></b-form-select>
  </b-form-group>
</template>

<script>
export default {
  name: 'PermissionOfProfile',
  components: {
  },
  props: {
    defaultInput: String,
    required: Boolean,
  },
  data() {
    return {
      input: this.defaultInput,
      backendFieldName: 'profile_permission',
      descript: '基本資料管理權限',
      type: '',
      content: [
        { value: 'X', text: '無權限' },
        { value: 'R', text: '讀取權限' },
        { value: 'W', text: '讀寫權限' },
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
