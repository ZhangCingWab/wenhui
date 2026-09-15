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
    // 文章点赞
    if(action === "like"){
      const body = await request.json();
      const {id} = body;
      await env.DB.prepare(`UPDATE articles SET like_count = like_count + 1 WHERE id=?`).bind(id).run();
      return Response.json({ok:true,msg:"点赞成功"},headers);
    }
    // 评论点赞
    if(action === "commentLike"){
      const body = await request.json();
      const {comment_id} = body;
      await env.DB.prepare(`UPDATE comments SET like_count = like_count + 1 WHERE id=?`).bind(comment_id).run();
      return Response.json({ok:true,msg:"评论点赞成功"},headers);
    }
    // 提交评论 / 回复评论
    if(action === "comment"){
      const body = await request.json();
      const {article_id,username,content,parent_id=null} = body;
      if(!content) return Response.json({ok:false,msg:"评论不能为空"},headers);
      const now = new Date().toISOString();
      await env.DB.prepare(`INSERT INTO comments (article_id,parent_id,username,content,create_time,like_count) VALUES (?,?,?,?,?,0)`)
        .bind(article_id,parent_id,username,content,now).run();
      return Response.json({ok:true,msg:"评论提交成功"},headers);
    }
    // 提交文章POST（没有action，放到所有action判断最后）
    else{
      try{
        const body = await request.json();
        const {title,content,cover,author} = body;
        const realAuthor = author ?? "匿名作者";
        const realCover = cover ?? "";
        if(!title || !content){
          return Response.json({ok:false,msg:"标题和内容不能为空"},headers);
        }
        const now = new Date().toISOString();
        await env.DB.prepare(`INSERT INTO articles (title,content,cover,author,create_time,status,like_count) VALUES (?,?,?,?,?,'pending',0)`).bind(title,content,cover,realAuthor,now).run();
          .bind(title,content,cover,author,now).run();
        return Response.json({ok:true,msg:"已经完成提交"},headers);
      }catch(e){
        return Response.json({ok:false,msg:"服务端异常:"+e.message},headers);
      }
    }
  }
  // ===== GET 请求 =====
  if(request.method === "GET"){
    // 读取公开文章首页
    if(!action){
      try{
        const res = await env.DB.prepare(`SELECT id,title,cover,author,create_time,like_count FROM articles WHERE status='approved' ORDER BY id DESC`).all();
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
      const res = await env.DB.prepare(`SELECT id,title,content,cover,author,create_time FROM articles WHERE status='pending' ORDER BY id DESC`).all();
      return Response.json({ok:true,data:res.results},headers);
    }
    // 获取单篇文章
    if(action === "article"){
      const id = url.searchParams.get("id");
      const res = await env.DB.prepare(`SELECT id,title,content,cover,author,create_time,like_count FROM articles WHERE id=? AND status='approved'`).bind(id).first();
      return Response.json({ok:true,data:res},headers);
    }
    // 获取文章评论（包含回复、评论点赞数）
    if(action === "comments"){
      const article_id = url.searchParams.get("id");
      const res = await env.DB.prepare(`SELECT id,parent_id,username,content,create_time,like_count FROM comments WHERE article_id=? ORDER BY id DESC`).bind(article_id).all();
      return Response.json({ok:true,data:res.results},headers);
    }
  }
}
