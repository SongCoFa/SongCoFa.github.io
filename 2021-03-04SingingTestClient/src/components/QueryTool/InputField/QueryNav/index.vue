<template>
  <b-row class="m-0">
    <b-col class="p-0">
      <b-nav align="left">
        <div class="btn btn-primary container-border rounded-0" @click="setQueryAreaCollapse">
          查詢
          <font-awesome-icon :icon="['fas', 'plus-circle']" v-if="isQueryAreaCollapsed" />
          <font-awesome-icon :icon="['fas', 'minus-circle']" v-else />
        </div>
      </b-nav>
    </b-col>
    <b-col class="p-0">
      <b-nav align="right">
        <Add v-if="AddListFormat" :AddListFormat="AddListFormat" :AddApi="AddApi" @refreshData="refreshData" :writable="writable"/>
        <Import v-if="ImportListFormat" :ImportListFormat="ImportListFormat" :ImportApi="ImportApi" :writable="writable" @refreshData="refreshData" />
        <slot name="selectForm"></slot>
        <slot name="checkButton"></slot>
        <slot name="checkVocation"></slot>
        <slot name="printButton"></slot>
        <slot name="downloadButton"></slot>
        <slot name="importWorkingHours"></slot>
        <slot name="importValueByDate"></slot>
      </b-nav>
    </b-col>
  </b-row>
</template>

<script>
import Add from '@/components/table/Modals/Add.vue';
import Import from '@/components/table/Modals/Import.vue';

export default {
  name: 'QueryNav',
  components: {
    Add,
    Import,
  },
  props: {
    AddListFormat: Array,
    ImportListFormat: Array,
    AddApi: String,
    ImportApi: String,
    writable: Boolean,
  },
  data() {
    return {
      isQueryAreaCollapsed: false,
    };
  },

  mounted() {},
  computed: {},
  methods: {
    setQueryAreaCollapse() {
      this.isQueryAreaCollapsed = !this.isQueryAreaCollapsed;
      this.$emit('setQueryAreaCollapse', this.isQueryAreaCollapsed);
    },
    refreshData() {
      this.$emit('refreshData');
    },
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
</style>
