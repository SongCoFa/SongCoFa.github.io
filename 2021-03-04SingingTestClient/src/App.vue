<template>
  <div id="app">
    <div class="green-line-top w-100"></div>
    <div class="green-line-bot w-100"></div>
    <div class="green-land w-100"></div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
.green-line-top{
  position: fixed;
  top:0;
  background-image:url('~@/assets/images/greenLine.png');
  background-repeat:repeat-x;
  height: 10px;
}

.green-line-bot{
  position: fixed;
  bottom:0;
  background-image:url('~@/assets/images/greenLine.png');
  background-repeat:repeat-x;
  height: 10px;
}
.green-land{
  position: fixed;
  bottom:10px;
  background-position: center;
  background-image:url('~@/assets/images/greenLand.png');
  background-repeat:no-repeat;
  height: 194px;
  z-index: -1;
}
</style>
