export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();
  const password = (formData.get('password') || '').trim();
  
  const expectedToken = env.SITE_PASSWORD || "fallback_secret_323339";

  // 1. 密码正确：种下 Cookie 并跳回首页
  if (password === expectedToken) {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/?logged_in=1',
        'Set-Cookie': `site_auth=${expectedToken}; Path=/; HttpOnly; SameSite=Lax`
      }
    });
  }
  
  // 2. 密码错误：返回带有错误提示的完整登录页 HTML
  const errorHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>身份验证</title>
<style>
  body { background: #0f0c20; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
  .box { background: #15102a; padding: 30px; border-radius: 12px; border: 1px solid #3d346d; text-align: center; width: 90%; max-width: 360px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
  h2 { margin-bottom: 25px; color: #00d2ff; font-size: 23px; font-weight: 900; text-shadow: 0 0 10px rgba(0,210,255,0.5); }
  input { width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #3d346d; background: #0f0c20; color: white; box-sizing: border-box; }
  button { width: 100%; padding: 10px; background: #2ed573; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
  button:hover { background: #26af5f; }
  .error { color: #ff3838; margin-top: 15px; font-size: 14px; font-weight: bold; }
</style>
</head>
<body>
<div class="box">
  <h2>欢迎访问<br>川大附中天堂网！</h2>
  <form method="POST" action="/__login">
    <input type="password" name="password" placeholder="请输入访问密码" required>
    <button type="submit">确认登录</button>
  </form>
  <p class="error">密码错误，拒绝访问！</p>
</div>
</body>
</html>`;

  return new Response(errorHtml, {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
