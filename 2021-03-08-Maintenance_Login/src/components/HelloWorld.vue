<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="signinbox">
      <div class="signinbg"></div>
      <img class="qrcode" src="../assets/QrCode.png">
      <button class="loginbtn"><a :href="signin()">訪客登入</a></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    signin(){
      return 'http://www.fmsbolymin.com.tw:8813/repair/#/login?90018;Song;Bolymin'
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: whitesmoke;
  text-decoration: none;
  transition: 0.7s;
}
a:visited {
  color: whitesmoke;
}
a:hover {
  color: rgb(53, 53, 53);
}
.hello{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.signinbox{
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 33vw;
  min-width: 300px;
  height: 40vh;
  min-height: 300px;
}
.signinbg{
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(224, 224, 224);
  opacity: 0.7;
  border-radius: 15px;
}
.qrcode{
  z-index: 30;
  width: 150px;
  height: 150px;
}
.loginbtn{
  width: 150px;
  height: 50px;
  border-radius: 6px;
  z-index: 20;
  font-size: 20px;
  font-weight: bold;
  color: whitesmoke;
  transition: 0.7s;
  background-color: rgb(50, 106, 158);
}
.loginbtn:hover{
  background-color: rgb(96, 226, 243);
}
</style>
