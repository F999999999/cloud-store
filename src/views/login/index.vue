<template>
  <div class="content">
    <div class="loginBox">
      <h2>云仓</h2>
      <form @submit="onSubmit">
        <div class="item">
          <input type="text" required v-model.trim="usernameField" />
          <label for="">账号</label>
          <span class="error" v-if="usernameError">{{ usernameError }} </span>
        </div>
        <div class="item">
          <input type="password" required v-model.trim="passwordField" />
          <label for="">密码</label>
          <span class="error" v-if="passwordError">{{ passwordError }} </span>
        </div>
        <button class="btn" type="submit">
          登录
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { loginByAccountAndPasswordApi } from "../../api/user";
import { useForm, useField } from "vee-validate";
import { password, username } from "../../utils/vee-validate-schema";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

const router = useRouter();
//所以需要的字段
const {
  usernameField,
  usernameError,
  passwordField,
  passwordError,
  usernameFormHandleSubmit,
} = useFormValidate();
//验证通过之后
const onSubmit = usernameFormHandleSubmit(({ username, password }) => {
  // console.log(username, password);
  //登录接口
  loginByAccountAndPasswordApi({ username, password })
    .then((res) => {
      if (res.status == 200) {
        // 设置一个sessionStorage(sessionStorage存储数据的时间是打开浏览器存储 关闭浏览器 数据消失)
        window.localStorage.setItem("token", res.data.token);
        message.success(res.message);
        //路由跳转
        router.push("/");
      } else {
        message.error(res.message);
      }
    })
    .catch((err) => {
      console.log("登录失败" + err);
    });
});

//表单校验
function useFormValidate() {
  const { handleSubmit: usernameFormHandleSubmit } = useForm({
    // 指定表单中包含的验证规则, 只有以下规则都验证通过了表单才可以提交
    validationSchema: {
      username,
      password,
    },
  });

  // 验证用户名
  const { value: usernameField, errorMessage: usernameError } =
    useField("username");
  // 验证密码
  const { value: passwordField, errorMessage: passwordError } =
    useField("password");

  return {
    usernameField,
    usernameError,
    passwordField,
    passwordError,
    usernameFormHandleSubmit,
  };
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

input,
button {
  background: transparent;
  border: 0;
  outline: none;
}

.content {
  height: 100vh;
  background: linear-gradient(#141e30, #243b55);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #03e9f4;
}

.loginBox {
  width: 400px;
  height: 364px;
  background-color: #0c1622;
  margin: 100px auto;
  border-radius: 10px;
  box-shadow: 0 15px 25px 0 rgba(0, 0, 0, 0.6);
  padding: 40px;
  box-sizing: border-box;
}

h2 {
  text-align: center;
  color: aliceblue;
  margin-bottom: 30px;
  font-family: "Courier New", Courier, monospace;
}

.item {
  height: 45px;
  border-bottom: 1px solid #fff;
  margin-bottom: 40px;
  position: relative;
}

.item input {
  width: 100%;
  height: 100%;
  color: #fff;
  padding-top: 20px;
  box-sizing: border-box;
}

.item input:focus + label,
.item input:valid + label {
  top: 0;
  font-size: 2px;
}

.item label {
  position: absolute;
  left: 0;
  top: 12px;
  transition: all 0.5s linear;
}

.btn {
  padding: 10px 20px;
  margin-top: 30px;
  color: #03e9f4;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 2px;
  /*left: 35%;*/
}

.btn:hover {
  border-radius: 5px;
  color: #fff;
  background: #03e9f4;
  box-shadow: 0 0 5px 0 #03e9f4, 0 0 25px 0 #03e9f4, 0 0 50px 0 #03e9f4,
    0 0 100px 0 #03e9f4;
  transition: all 1s linear;
}

.btn > span {
  position: absolute;
}

.btn > span:nth-child(1) {
  width: 100%;
  height: 2px;
  background: -webkit-linear-gradient(left, transparent, #03e9f4);
  left: -100%;
  top: 0;
  animation: line1 1s linear infinite;
}

@keyframes line1 {
  50%,
  100% {
    left: 100%;
  }
}

.btn > span:nth-child(2) {
  width: 2px;
  height: 100%;
  background: -webkit-linear-gradient(top, transparent, #03e9f4);
  right: 0;
  top: -100%;
  animation: line2 1s 0.25s linear infinite;
}

@keyframes line2 {
  50%,
  100% {
    top: 100%;
  }
}

.btn > span:nth-child(3) {
  width: 100%;
  height: 2px;
  background: -webkit-linear-gradient(left, #03e9f4, transparent);
  left: 100%;
  bottom: 0;
  animation: line3 1s 0.75s linear infinite;
}

@keyframes line3 {
  50%,
  100% {
    left: -100%;
  }
}

.btn > span:nth-child(4) {
  width: 2px;
  height: 100%;
  background: -webkit-linear-gradient(top, transparent, #03e9f4);
  left: 0;
  top: 100%;
  animation: line4 1s 1s linear infinite;
}

@keyframes line4 {
  50%,
  100% {
    top: -100%;
  }
}
.error {
  color: red;
}
</style>
