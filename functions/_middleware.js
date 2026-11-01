// functions/_middleware.js
// 全站守卫：所有请求先经过这里，验证 Cookie 后才放行到静态资源

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 放行登录接口本身，否则永远无法提交密码
  if (url.pathname === '/__login') {
    return next();
  }

  const cookieHeader = request.headers.get('Cookie') || '';
  const expectedToken = env.SITE_PASSWORD; // 直接用密码本身作为令牌的简单方案
  const hasValidCookie = cookieHeader
    .split(';')
    .map(c => c.trim())
    .some(c => c === `site_auth=${expectedToken}`);

  if (hasValidCookie) {
    return next(); // ✅ 已验证，放行到你的静态页面
  }

  // ❌ 未验证：返回自定义登录页
  return new Response(renderLoginPage(url.pathname), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function renderLoginPage(originalPath) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>身份验证</title>
<style>
  body { background: #0f0c20; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
  .login-box { background: #15102a; padding: 30px; border-radius: 12px; border: 1px solid #3d346d; text-align: center; width: 90%; max-width: 360px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
  h2 { margin-bottom: 25px; color: #00d2ff; font-size: 23px; line-height: 1.4; font-weight: 900; letter-spacing: 1px; text-shadow: 0 0 10px rgba(0, 210, 255, 0.5), 0 0 25px rgba(0, 210, 255, 0.2); }
  input[type="password"] { width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #3d346d; background: #0f0c20; color: white; box-sizing: border-box; }
  button { width: 100%; padding: 10px; background: #2ed573; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
  button:hover { background: #26af5f; }
  #error-msg { color: #ff3838; margin-top: 10px; font-size: 14px; }
  @media (max-width: 340px) { h2 { font-size: 19px; } }
</style>
</head>
<body>
<div class="login-box">
  <h2>欢迎访问<br>川大附中天堂网！</h2>
  <form method="POST" action="/__login">
    <input type="hidden" name="redirect" value="${escapeHtml(originalPath)}">
    <input type="password" name="password" placeholder="请输入访问密码" required>
    <button type="submit">确认登录</button>
  </form>
  <p id="error-msg"></p>
</div>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}
