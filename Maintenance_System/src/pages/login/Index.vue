<template>
  <q-page>
      <div class="hello text_big">登入中請稍後...</div>
  </q-page>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      User: {
        id: null,
        name: null,
        OperatorCode: null
      },
      isTest: false
    }
  },
  mounted () {
    if (this.isTest) {
      window.sessionStorage.setItem('Number', '90001')
      window.sessionStorage.setItem('Name', '楊德祥')
      window.sessionStorage.setItem('Vender', 'Bolymin')
    }
    this.User.id = window.sessionStorage.getItem('Number')
    this.User.name = window.sessionStorage.getItem('Name')
    this.User.OperatorCode = window.sessionStorage.getItem('Vender')
    // 判斷是否存有報修主表查詢條件，若有則清除
    const query = window.sessionStorage.getItem('start_datetime')
    if (query !== null) {
      this.cleanQuery()
    }
    if (this.User.id !== null) {
      this.resetUrl()
    } else {
      this.getUser()
    }
    // this.resetUrl()
  },
  methods: {
    getUser () {
      try {
        // 取得網址列傳來的使用者參數並解析
        const serverURL = window.location.href
        const decodeURL = decodeURI(serverURL)
        const first = decodeURL.split('/')
        const second = first[5].split('?')
        const third = second[1].split('3')
        const Num = third[0].split('')
        const Name = third[1].split('')
        const Vender = third[2].split('')
        Num.pop()
        Vender.shift()
        Name.pop()
        Name.shift()
        let userid = ''
        let username = ''
        let uservender = ''
        for (var i = 0; i < Num.length; i++) {
          userid = userid + Num[i]
        }
        for (var j = 0; j < Name.length; j++) {
          username = username + Name[j]
        }
        for (var k = 0; k < Vender.length; k++) {
          uservender = uservender + Vender[k]
        }
        // console.log(userid, username, uservender)
        window.sessionStorage.setItem('Number', userid)
        window.sessionStorage.setItem('Name', username)
        window.sessionStorage.setItem('Vender', uservender)
        // 把網址洗掉避免被看到使用者參數
        this.resetUrl()
      } catch (e) {
        alert('尚未登入，http://www.fmsbolymin.com.tw/，請由此進入報修系統')
        console.log(e)
        window.open('http://www.fmsbolymin.com.tw/', '_blank')
        window.close()
      }
    },
    resetUrl () {
      this.$root.reload = this.$router.replace({ name: '報修主頁' })
    },
    cleanQuery () {
      window.sessionStorage.removeItem('start_datetime')
      window.sessionStorage.removeItem('end_datetime')
      window.sessionStorage.removeItem('status')
      window.sessionStorage.removeItem('bus_no')
    }
  }
}
</script>

<style lang="scss" scoped>
  .hello{
    position: absolute;
    left: calc(50vw - 150px);
    top: calc(50vh - 150px);
    display: flex;
    height: 300px;
    width: 300px;
    justify-content: center;
    align-items: center;
  }
</style>
