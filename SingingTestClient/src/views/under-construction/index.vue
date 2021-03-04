<template>
    <router-link to="/"
    class="d-flex flex-column flex-grow-1 justify-content-center align-items-center pb-5">
      <h4 class="font-weight-bold pb-2 titleStyle">
        <font-awesome-icon :icon="['fas', 'hammer']" />
        <span class="ml-2">Under Construction</span>
      </h4>
      <p>Something big is Coming Soon!</p>
    </router-link>
</template>

<script>
export default {
  name: 'UnderConstruction',
};
</script>

<style scoped lang="scss">
  .titleStyle {
    border-bottom-style: solid;
  }
</style>
