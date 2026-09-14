export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  const body = await request.json();
  const { username, password } = body;

  const row = await env.wenhui_users.prepare(
    `SELECT * FROM users WHERE username = ?`
  ).bind(username).first();

  if (!row) {
    return Response.json({ ok: false, msg: "用户名不存在" }, { headers: corsHeaders });
  }

  const encoder = new TextEncoder();
  const hashBuf = await crypto.subtle.digest("SHA-256", encoder.encode(password));
  const hashArr = Array.from(new Uint8Array(hashBuf));
  const hashStr = hashArr.map(b => b.toString(16).padStart(2, '0')).join('');

  if (hashStr === row.password) {
    return Response.json({
      ok: true,
      msg: "登录成功",
      uid: row.id,
      username: row.username
    }, { headers: corsHeaders });
  } else {
    return Response.json({ ok: false, msg: "密码错误" }, { headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
