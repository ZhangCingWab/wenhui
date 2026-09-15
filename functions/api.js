export async function onRequest(context) {
  const headers = {
    "Content-Type": "application/json"
  };
  const {request, env} = context;
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  // ===== POST 请求 =====
  if(request.method === "POST"){
    // 审核操作 POST /api?action=audit
    if(action === "audit"){
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
    // 点赞接口 POST /api?action=like
    if(action === "like"){
      const body = await request.json();
      const {id} = body;
      await env.DB.prepare(`UPDATE articles SET like_count = like_count + 1 WHERE id=?`).bind(id).run();
      return Response.json({ok:true,msg:"点赞成功"},headers);
    }
    // 新增评论 POST /api?action=comment
    if(action === "comment"){
      const body = await request.json();
      const {article_id,content} = body;
      if(!content) return Response.json({ok:false,msg:"评论不能为空"},headers);
      const now = new Date().toISOString();
      await env.DB.prepare(`INSERT INTO comments (article_id,content,create_time) VALUES (?,?,?)`)
        .bind(article_id,content,now).run();
      return Response.json({ok:true,msg:"评论提交成功"},headers);
    }
    // 提交文章POST（没有action，放到所有action判断最后）
    else{
      try{
        const body = await request.json();
        const {title,content,cover} = body;
        if(!title || !content){
          return Response.json({ok:false,msg:"标题和内容不能为空"},headers);
        }
        const now = new Date().toISOString();
        await env.DB.prepare(`INSERT INTO articles (title,content,cover,create_time,status,like_count) VALUES (?,?,?,?,'pending',0)`)
          .bind(title,content,cover,now).run();
        return Response.json({ok:true,msg:"已经完成提交"},headers);
      }catch(e){
        return Response.json({ok:false,msg:"服务端异常:"+e.message},headers);
      }
    }
  }
  // ===== GET 请求 =====
  if(request.method === "GET"){
    // 读取公开文章首页（侧边栏文章库用，返回封面+标题）
    if(!action){
      try{
        const res = await env.DB.prepare(`SELECT id,title,cover,create_time,like_count FROM articles WHERE status='approved' ORDER BY id DESC`).all();
        return Response.json({ok:true,data:res.results},headers);
      }catch(e){
        return Response.json({ok:false,msg:"服务端异常:"+e.message},headers);
      }
    }
    // 获取待审核列表
    if(action === "pending"){
      const pwd = url.searchParams.get("pwd");
      const ADMIN_PASSWORD = "123456";
      if(pwd!==ADMIN_PASSWORD){
        return Response.json({ok:false,msg:"密码错误，无权访问"},headers);
      }
      const res = await env.DB.prepare(`SELECT id,title,content,cover,create_time FROM articles WHERE status='pending' ORDER BY id DESC`).all();
      return Response.json({ok:true,data:res.results},headers);
    }
    // 获取单篇文章 GET /api?action=article&id=xxx
    if(action === "article"){
      const id = url.searchParams.get("id");
      const res = await env.DB.prepare(`SELECT id,title,content,cover,create_time,like_count FROM articles WHERE id=? AND status='approved'`).bind(id).first();
      return Response.json({ok:true,data:res},headers);
    }
    // 获取文章评论 GET /api?action=comments&id=xxx
    if(action === "comments"){
      const article_id = url.searchParams.get("id");
      const res = await env.DB.prepare(`SELECT id,content,create_time FROM comments WHERE article_id=? ORDER BY id DESC`).bind(article_id).all();
      return Response.json({ok:true,data:res.results},headers);
    }
  }
}
