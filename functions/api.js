export async function onRequestPost(context) {
  const headers = {
    "Content-Type": "application/json"
  };
  const {request, env} = context;
  try{
    const body = await request.json();
    const {title,content} = body;
    if(!title || !content){
      return Response.json({ok:false,msg:"标题和内容不能为空"},headers);
    }
    const now = new Date().toISOString();
    await env.DB.prepare(`INSERT INTO articles (title,content,create_time,status) VALUES (?,?,?,'pending')`)
      .bind(title,content,now).run();
    return Response.json({ok:true,msg:"提交成功，等待管理员审核"},headers);
  }catch(e){
    return Response.json({ok:false,msg:"服务端异常:"+e.message},headers);
  }
}

export async function onRequestGet(context){
  const headers = {
    "Content-Type": "application/json"
  };
  const {request, env} = context;
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  // 读取公开文章（首页用，不需要密码）
  if(!action){
    try{
      const res = await env.DB.prepare(`SELECT id,title,create_time FROM articles WHERE status='approved' ORDER BY id DESC`).all();
      return Response.json({ok:true,data:res.results},headers);
    }catch(e){
      return Response.json({ok:false,msg:"服务端异常:"+e.message},headers);
    }
  }

  // 获取待审核文章，需要密码
  if(action === "pending"){
    const pwd = url.searchParams.get("pwd");
    const ADMIN_PASSWORD = "123456";
    if(pwd!==ADMIN_PASSWORD){
      return Response.json({ok:false,msg:"密码错误，无权访问"},headers);
    }
    const res = await env.DB.prepare(`SELECT id,title,content,create_time FROM articles WHERE status='pending' ORDER BY id DESC`).all();
    return Response.json({ok:true,data:res.results},headers);
  }
}

// 审核操作接口（通过/驳回）
export async function onRequest(context){
  const headers = {
    "Content-Type": "application/json"
  };
  const {request, env} = context;
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if(request.method === "POST" && action === "audit"){
    const pwd = url.searchParams.get("pwd");
    const ADMIN_PASSWORD = "123456";
    if(pwd!==ADMIN_PASSWORD){
      return Response.json({ok:false,msg:"密码错误，无权审核"},headers);
    }
    const body = await request.json();
    const {id,status} = body;
    await env.DB.prepare(`UPDATE articles SET status=? WHERE id=?`).bind(status,id).run();
    return Response.json({ok:true,msg:"审核完成"},headers);
  }
}
