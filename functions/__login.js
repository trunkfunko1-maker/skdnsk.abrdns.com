// functions/__login.js
// 登录接口：POST /__login
// 验证密码，设置 Cookie，重定向回原页面

export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();
  const password = (formData.get('password') || '').trim();
  const redirectPath = formData.get('redirect') || '/';

  if (password === env.SITE_PASSWORD) {
    const res = new Response(null, {
      status: 302,
      headers: {
        'Location': redirectPath,
        'Set-Cookie': `site_auth=${encodeURIComponent(password)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
      }
    });
    return res;
  }

  // 密码错误：返回登录页，带错误提示
  const url = new URL(request.url);
  const errorHtml = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>身份验证</title>
<style>
body { background: #0f0c20; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
.login-box { background: #15102a; padding: 30px; border-radius: 12px; border: 1px solid #3d346d; text-align: center; width: 90%; max-width: 360px; }
h2 { color: #00d2ff; font-size: 23px; text-shadow: 0 0 10px rgba(0,210,255,0.5); }
input[type="password"] { width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #3d346d; background: #0f0c20; color: white; box-sizing: border-box; }
button { width: 100%; padding: 10px; background: #2ed573; color: white; border: none; border-radius: 6px; font-weight: bold; }
#error-msg { color: #ff3838; margin-top: 10px; font-size: 14px; }
</style></head><body>
<div class="login-box">
<h2>欢迎访问<br>川大附中天堂网！</h2>
<form method="POST" action="/__login">
<input type="hidden" name="redirect" value="${escapeHtml(redirectPath)}">
<input type="password" name="password" placeholder="请输入访问密码" required>
<button type="submit">确认登录</button>
</form>
<p id="error-msg">密码错误，拒绝访问！</p>
</div></body></html>`;

  return new Response(errorHtml, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}
