export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  const body = await request.json();
  const { username, password, email } = body;

  if (!username || !password) {
    return Response.json({ ok: false, msg: "用户名和密码不能为空" }, { headers: corsHeaders });
  }

  // SHA256哈希加密密码
  const encoder = new TextEncoder();
  const hashBuf = await crypto.subtle.digest("SHA-256", encoder.encode(password));
  const hashArr = Array.from(new Uint8Array(hashBuf));
  const hashStr = hashArr.map(b => b.toString(16).padStart(2, '0')).join('');

  try {
    await env.wenhui_users.prepare(
      `INSERT INTO users(username,password,email) VALUES (?,?,?)`
    ).bind(username, hashStr, email).run();
    return Response.json({ ok: true, msg: "注册成功！" }, { headers: corsHeaders });
  } catch (e) {
    if (e.message.includes("UNIQUE constraint failed")) {
      return Response.json({ ok: false, msg: "用户名已经被占用" }, { headers: corsHeaders });
    }
    return Response.json({ ok: false, msg: "注册失败" }, { headers: corsHeaders });
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
