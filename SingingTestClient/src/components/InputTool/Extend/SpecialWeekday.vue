<template>
  <b-form-group :label="descript" :state="state">
    <b-form-select
      class="form-control"
      v-model="input"
      :options="content"
      value-field="value"
      text-field="text"
      :state="state"
    >
    </b-form-select>
  </b-form-group>
</template>

<script>
  export default {
    name: 'SpecialWeekday',
    components: {
    },
    props: {
      defaultInput: String,
      required: Boolean,
    },
    data() {
      return {
        input: this.defaultInput,
        backendFieldName: 'weekday',
        descript: '設定值',
        type: 'Option',
        content: [
          {
            text: '請選擇',
            value: null,
          },
          {
            text: '週一',
            value: '週一',
          },
          {
            text: '週二',
            value: '週二',
          },
          {
            text: '週三',
            value: '週三',
          },
          {
            text: '週四',
            value: '週四',
          },
          {
            text: '週五',
            value: '週五',
          },
          {
            text: '週六',
            value: '週六',
          },
          {
            text: '週日',
            value: '週日',
          },
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
