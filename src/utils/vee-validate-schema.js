export function username(value) {
  if (!value) return "请输入用户名";
  if (!/^\w{4,20}$/.test(value)) return "账号必须4-20个字符";
  return true;
}
export function password(value) {
  if (!value) return "请输入密码";
  if (!/^[a-zA-Z0-9]{6,20}$/.test(value))
    return "密码必须是字母和数字的组合6-20个字符";
  return true;
}
