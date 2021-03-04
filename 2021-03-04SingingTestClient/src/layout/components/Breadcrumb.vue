<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb h4 m-0 bg-transparent">
      <li class="breadcrumb-item active" v-for="(item, key) in items" :key="key">
        <span class="font-weight-bold">{{item.text }}</span>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  props: {
    items: Array,
  },
};
</script>

<style lang="scss" scoped>

</style>
