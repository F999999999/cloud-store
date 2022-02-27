<template>
  <div class="login">
    <div class="container">
      <h3 class="login-title">云仓-智能仓储管理系统</h3>
      <!-- 登录表单  -->
      <div class="login-form"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
}

.login .container {
  width: 400px;
  height: 350px;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: yellow;
  padding: 85px 45px 45px;
  border-radius: 5px;
}

.login-title {
  padding: 0;
  margin: 0 0 10px 0;
  font-weight: normal;
}

.login-form {
  background-color: green;
  width: 100%;
  height: 260px;
  border-radius: 5px;
}
</style>
