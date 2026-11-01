export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();
  const password = (formData.get('password') || '').trim();
  
  const expectedToken = env.SITE_PASSWORD || "fallback_secret_323339";

  if (password === expectedToken) {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': `site_auth=${expectedToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
      }
    });
  }
  
  return new Response("密码错误，请返回重试", { status: 401, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
