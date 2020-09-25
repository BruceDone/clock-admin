<template>
  <div class="login-regist-box">
    <vue-particle-line></vue-particle-line>
    <div class="login-box">
      <h1 class="title">CLOCK-ADMIN</h1>
      <login-form @on-success-valid="handleSubmit"></login-form>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'

export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(['handleLogin'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.$router.push({
          name: this.$config.homeName
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .login-regist-box {
    background: #fff;
    height: 100vh;

    .login-box {
      width: 20vw;
      position: absolute;
      left: 60%;
      margin-left: -22vw;
      top: 25vh;
    }

    .vPic {
      position: absolute;
      right: 10px;
      bottom: 0px;
    }
  }

  .title {
    font-size: 32px;
    margin-bottom: 32px;
    text-align: center;
  }
</style>
