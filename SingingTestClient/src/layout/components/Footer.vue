<template>
  <footer class="mt-auto">
    <div class="navbar">
      <strong>

        <a href="http://bolymin.com.tw/"> © 2019 - {{nowYear}} - Bolymin Web Application</a>
      </strong>
      <span class="ml-auto">
        <b> Version: </b>{{$store.state.nowVersion}}
      </span>
    </div>
  </footer>
</template>

<script>

export default {
  name: 'Footer',
  computed: {
    nowYear() {
     return new Date().getFullYear();
    },
  },
};

</script>

<style lang="scss" scoped>
  footer > .navbar {
    //background-color: rgba($color: #ffffff, $alpha: 0.5);
    border-top: 1px #194c28 solid;
  }
</style>
