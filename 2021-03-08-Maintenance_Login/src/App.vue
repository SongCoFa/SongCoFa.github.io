<template>
  <div id="app">
    <HelloWorld msg="歡迎使用行動裝置體驗報修系統"/>
    <vue-particles
      class="backgroundimg"
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
body{
  margin: 0;
}
@media (max-width:500px) {
  h1{
    font-size: 20px;
  }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.backgroundimg{
  position: absolute;
  top: 0;
  z-index: -20;
  width: 100vw;
  height: 100vh;
  min-height: 450px;
  background-color: rgb(86, 85, 150);
  animation-name: change_color;
  animation-duration: 30s;
  animation-iteration-count: infinite;
}
@keyframes change_color{
    20%{
        background-color: rgb(47, 150, 168);
    }
    40%{
        background-color: rgb(104, 155, 98);
    }
    60%{
        background-color: rgb(168, 82, 67);
    }
    80%{
        background-color: rgb(185, 121, 173);
    }
}
</style>
