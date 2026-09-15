export async function onRequestPost(context) {
  const headers = {
    "Content-Type": "application/json"
  };
  const {request, env} = context;
  const body = await request.json();
  const {title,content} = body;
  if(!title || !content){
    return Response.json({ok:false,msg:"标题和内容不能为空"},headers);
  }
  const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO articles (title,content,create_time) VALUES (?,?,?)`)
    .bind(title,content,now).run();
  return Response.json({ok:true,msg:"发表成功"},headers);
}

export async function onRequestGet(context){
  const headers = {
    "Content-Type": "application/json"
  };
  const {env} = context;
  const res = await env.DB.prepare(`SELECT id,title,create_time FROM articles ORDER BY id DESC`).all();
  return Response.json({ok:true,data:res.results},headers);
}
