export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 🚧 维护模式总开关：true = 开启维护；false = 正常访问
  const MAINTENANCE_MODE = true; 

  if (MAINTENANCE_MODE) {
    // 核心修复：同时允许 /maintenance 和 /maintenance.html 访问
    const isMaintenancePage = url.pathname === '/maintenance' || url.pathname === '/maintenance.html';
    
    if (!isMaintenancePage) {
      // 跳转时直接带上 .html，Cloudflare 会自动处理
      return Response.redirect(new URL('/maintenance.html', url).toString(), 302);
    }
    return next(); // 放行维护页本身，交给静态文件系统处理
  }

  // ---- 以下为正常登录与拦截逻辑 ----
  
  if (url.searchParams.has('logout')) {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': 'site_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
      }
    });
  }

  if (url.pathname === '/__logout_beacon') {
    return new Response(null, {
      status: 204,
      headers: {
        'Set-Cookie': 'site_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
      }
    });
  }

  if (url.pathname === '/__login') {
    return next();
  }

  const cookieHeader = request.headers.get('Cookie') || '';
  const expectedToken = env.SITE_PASSWORD || "fallback_secret_323339";
  
  if (cookieHeader.includes(`site_auth=${expectedToken}`)) {
    return next();
  }

  const html = `<!DOCTYPE html>
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
</style>
</head>
<body>
<div class="box">
  <h2>欢迎访问<br>川大附中天堂网！</h2>
  <form method="POST" action="/__login">
    <input type="password" name="password" placeholder="请输入访问密码" required>
    <button type="submit">确认登录</button>
  </form>
</div>
</body>
</html>`;

  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
}
