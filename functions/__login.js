export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();
  const password = (formData.get('password') || '').trim();
  
  const expectedToken = env.SITE_PASSWORD || "fallback_secret_323339";

  if (password === expectedToken) {
    return new Response(null, {
      status: 302,
      headers: {
        // 注意这里加了 ?logged_in=1
        'Location': '/?logged_in=1',
        // 依然是会话 Cookie（没有 Max-Age），关浏览器即死
        'Set-Cookie': `site_auth=${expectedToken}; Path=/; HttpOnly; SameSite=Lax`
      }
    });
  }
  
  return new Response("密码错误，请返回重试", { status: 401, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
