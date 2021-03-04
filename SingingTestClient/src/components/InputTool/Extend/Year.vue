<template>
  <b-form-group :label="descript" :state="state">
    <b-form-input
      type="number"
      v-model="input"
      :state="state"
      :formatter="formatYear"
      @input="$emit('updateInput', $event === ''? null: $event)"
      trim
    ></b-form-input>
  </b-form-group>
</template>

<script>
export default {
  name: 'Year',
  components: {
  },
  props: {
    defaultInput: String,
    required: Boolean,
  },
  data() {
    return {
      input: this.defaultInput,
      backendFieldName: 'year',
      descript: '年份',
      type: 'Number',
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
  methods: {
    formatYear(e) {
      return String(e).substring(0, 4);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
