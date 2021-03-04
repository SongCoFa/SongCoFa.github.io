<template>
  <div class="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
    <h4 class="font-weight-bold pb-2 titleStyle">
      <img src="@/assets/images/main.png" class="main-img" />
    </h4>
    <h2 class="font-weight-bold">歡迎使用新營客運管理系統</h2>
    <div class="space"></div>
  </div>
</template>

<script>
export default {
  name: 'Main',
};
</script>

<style scoped lang="scss">
.main-img {
  width: 400px;
}
.titleStyle {
  border-bottom-style: solid;
}
.space {
  height: 200px;
}
</style>
