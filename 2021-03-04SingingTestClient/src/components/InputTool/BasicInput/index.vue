<template>
  <b-form-input
    v-if="type === 'String'"
    type="text"
    :placeholder="placeholderDescript"
    :value="input"
    @input="$emit('updateInput', $event === ''? null: $event)"
    :state="state"
    trim
  />

  <b-form-input
    v-else-if="type === 'Number'"
    type="number"
    :placeholder="placeholderDescript"
    :value="input"
    @input="$emit('updateInput', $event === ''? null: $event)"
    :state="state"
    trim
  />

  <b-form-textarea
    v-else-if="type === 'LongString'"
    :placeholder="placeholderDescript"
    :value="input"
    @input="$emit('updateInput', $event === ''? null: $event)"
    :state="state"
    rows="1"
    max-rows="6"
  ></b-form-textarea>

  <b-form-input
    v-else-if="type === 'Date'"
    type="date"
    :placeholder="placeholderDescript"
    :value="input"
    @input="$emit('updateInput', $event === ''? null: $event)"
    :state="state"
    trim
  />

  <b-form-input
    v-else-if="type === 'Time'"
    type="time"
    :placeholder="placeholderDescript"
    :value="input"
    @input="$emit('updateInput', $event === ''? null: $event)"
    :state="state"
    trim
  />

  <b-form-select
    v-else-if="type === 'Boolean'"
    class="form-control"
    :value="input"
    @input="$emit('updateInput', $event)"
    :state="state"
  >
    <option :value="null">請選擇</option>
    <option
      v-for="(item, index) in content"
      :value="item"
      :selected="item === input"
      :key="item"
    >{{index}}</option>
  </b-form-select>

  <b-form-select
    v-else-if="type === 'Option'"
    class="form-control"
    :value="input"
    @input="$emit('updateInput', $event)"
    :state="state"
  >
    <option :value="null">請選擇{{descript}}</option>
    <option
      v-for="(item, index) in content"
      :value="item"
      :selected="item === input"
      :key="index"
    >{{item}}</option>
  </b-form-select>

  <b-form-select
    v-else-if="type === 'NonNullOption'"
    class="form-control"
    :value="input"
    @input="$emit('updateInput', $event)"
    :state="state"
  >
    <option
      v-for="(item, index) in content"
      :value="item"
      :selected="item === input"
      :key="index"
    >{{item}}</option>
  </b-form-select>

  <b-form-select
    v-else-if="type === 'ValueTextSelection'"
    class="form-control"
    :value="input"
    :options="content"
    value-field="value"
    text-field="text"
    @input="$emit('updateInput', $event)"
    :state="state"
  >
  </b-form-select>
</template>

<script>
export default {
  name: 'BasicInput',
  components: {},
  model: {
    prop: 'input',
    event: 'updateInput',
  },
  props: {
    input: [String, Boolean, Number],
    descript: String,
    type: String,
    content: null,
    state: null,
  },

  mounted() {},
  computed: {
    placeholderDescript() {
      return `請輸入${this.descript}`;
    },
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
</style>
