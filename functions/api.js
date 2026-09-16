export async function onRequest(context) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  const {request, env} = context;
  const url = new URL(request.url);
  const action = url.searchParams.get("action"); 
  if(request.method === "OPTIONS"){
    return new Response(null,{headers});
  }
  // ===== POST 请求 =====
  if(request.method === "POST"){
    //管理员登录
    if(action === "adminLogin"){
      const pwd = url.searchParams.get("pwd");
      const ADMIN_PASSWORD = env.ADMIN_PASSWORD;
      if(pwd===ADMIN_PASSWORD){
        return Response.json({ok:true,msg:"登录成功"},headers);
      }else{
        return Response.json({ok:false,msg:"密码错误"},headers);
      }
    }
    // 文章审核 texts
    if(action === "auditText"){
      const pwd = url.searchParams.get("pwd");
      const ADMIN_PASSWORD = env.ADMIN_PASSWORD;
      if(pwd!==ADMIN_PASSWORD){
        return Response.json({ok:false,msg:"密码错误，无权审核"},headers);
      }
      const body = await request.json();
      const {id,status} = body;
      await env.DB.prepare(`UPDATE texts SET status=? WHERE id=?`).bind(status,id).run();
      return Response.json({ok:true,msg:"文章审核完成"},headers);
    }
    // 帖子审核 articles 【统一使用 approved】
    if(action === "auditArticle"){
      const pwd = url.searchParams.get("pwd");
      const ADMIN_PASSWORD = env.ADMIN_PASSWORD;
      if(pwd!==ADMIN_PASSWORD){
        return Response.json({ok:false,msg:"密码错误，无权审核"},headers);
      }
      const body = await request.json();
      const {id,status} = body;
      await env.DB.prepare(`UPDATE articles SET status=? WHERE id=?`).bind(status,id).run();
      return Response.json({ok:true,msg:"帖子审核完成"},headers);
    }
    // 帖子点赞 / 取消点赞
    if(action === "likeArticle"){
      const body = await request.json();
      const {id,isCancel} = body;
      const username = url.searchParams.get("username");
      if(isCancel){
        //取消点赞
        await env.DB.prepare(`DELETE FROM likes WHERE username=? AND target_type='article' AND target_id=?`).bind(username,id).run();
        await env.DB.prepare(`UPDATE articles SET like_count = like_count - 1 WHERE id=?`).bind(id).run();
        return Response.json({ok:true,msg:"取消点赞"},headers);
      }else{
        try{
          await env.DB.prepare(`INSERT INTO likes(username,target_type,target_id) VALUES (?, ?, ?)`).bind(username,"article",id).run();
          await env.DB.prepare(`UPDATE articles SET like_count = like_count + 1 WHERE id=?`).bind(id).run();
          return Response.json({ok:true,msg:"点赞成功"},headers);
        }catch(e){
          return Response.json({ok:false,msg:"已点赞"},headers);
        }
      }
    }
    //评论点赞/取消点赞
    if(action === "commentLike"){
      const body = await request.json();
      const {comment_id,isCancel} = body;
      const username = url.searchParams.get("username");
      if(isCancel){
        await env.DB.prepare(`DELETE FROM likes WHERE username=? AND target_type='comment' AND target_id=?`).bind(username,comment_id).run();
        await env.DB.prepare(`UPDATE comments SET like_count = like_count - 1 WHERE id=?`).bind(comment_id).run();
        return Response.json({ok:true,msg:"取消点赞"},headers);
      }else{
        try{
          await env.DB.prepare(`INSERT INTO likes(username,target_type,target_id) VALUES (?, ?, ?)`).bind(username,"comment",comment_id).run();
          await env.DB.prepare(`UPDATE comments SET like_count = like_count + 1 WHERE id=?`).bind(comment_id).run();
          return Response.json({ok:true,msg:"评论点赞成功"},headers);
        }catch(e){
          return Response.json({ok:false,msg:"已点赞"},headers);
        }
      }
    }
    // 文章点赞 texts
    if(action === "likeText"){
      const body = await request.json();
      const {id,isCancel} = body;
      const username = url.searchParams.get("username");
      if(isCancel){
        await env.DB.prepare(`DELETE FROM likes WHERE username=? AND target_type='text' AND target_id=?`).bind(username,id).run();
        await env.DB.prepare(`UPDATE texts SET like_count = like_count - 1 WHERE id=?`).bind(id).run();
        return Response.json({ok:true},headers);
      }else{
        try{
          await env.DB.prepare(`INSERT INTO likes(username,target_type,target_id) VALUES (?, ?, ?)`).bind(username,"text",id).run();
          await env.DB.prepare(`UPDATE texts SET like_count = like_count + 1 WHERE id=?`).bind(id).run();
          return Response.json({ok:true},headers);
        }catch(e){
          return Response.json({ok:false},headers);
        }
      }
    }
    // 提交文章（text.html编辑器 / submit.html 文件投稿）
    if(action === "submitText"){
      try{
        const body = await request.json();
        const {title,content,cover,author} = body;
        const realAuthor = (author!==undefined)?author:"匿名作者";
        const realCover = (cover!==undefined)?cover:"";
        if(!title || !content){
          return Response.json({ok:false,msg:"标题和内容不能为空"},headers);
        }
        const now = new Date().toISOString();
        await env.DB.prepare(`INSERT INTO texts (title,content,cover,author,create_time,status,like_count) VALUES (?,?,?,?,?,'pending',0)`)
        .bind(title,content,realCover,realAuthor,now).run();
        return Response.json({ok:true,msg:"文章提交成功，等待审核"},headers);
      }catch(e){
        return Response.json({ok:false,msg:"服务端异常:"+e.message},headers);
      }
    }
    // 提交论坛帖子（存入原有 articles）
    if(action === "submitArticle"){
      try{
        const body = await request.json();
        const {title,content,cover,author} = body;
        const realAuthor = (author!==undefined)?author:"匿名作者";
        const realCover = (cover!==undefined)?cover:"";
        if(!title || !content){
          return Response.json({ok:false,msg:"标题和内容不能为空"},headers);
        }
        const now = new Date().toISOString();
        await env.DB.prepare(`INSERT INTO articles (title,content,cover,author,create_time,status,like_count) VALUES (?,?,?,?,?,'pending',0)`)
        .bind(title,content,realCover,realAuthor,now).run();
        return Response.json({ok:true,msg:"帖子提交成功，等待审核"},headers);
      }catch(e){
        return Response.json({ok:false,msg:"服务端异常:"+e.message},headers);
      }
    }
    // 帖子评论 全部保留
    if(action === "comment"){
      const body = await request.json();
      const {target_type,target_id,username,content,parent_id} = body;
      const realParent = (parent_id!==undefined)?parent_id:null;
      if(!content) return Response.json({ok:false,msg:"评论不能为空"},headers);
      const now = new Date().toISOString();
      await env.DB.prepare(`INSERT INTO comments (target_type,target_id,parent_id,username,content,create_time,like_count) VALUES (?,?,?,?,?,?,0)`)
        .bind(target_type,target_id,realParent,username,content,now).run();
      return Response.json({ok:true,msg:"评论提交成功"},headers);
    }
  }
  // ===== GET 请求 =====
  if(request.method === "GET"){
    // 已审核文章列表
    if(action === "textList"){
      try{
        const res = await env.DB.prepare(`SELECT id,title,cover,author,create_time,like_count FROM texts WHERE status='approved' ORDER BY id DESC`).all();
        return Response.json({ok:true,data:res.results},headers);
      }catch(e){
        return Response.json({ok:false,msg:"服务端异常:"+e.message},headers);
      }
    }
    // 已审核帖子列表（论坛广场）查询条件 status='approved'
    if(action === "articleList"){
      try{
        const res = await env.DB.prepare(`SELECT id,title,cover,author,create_time,like_count FROM articles WHERE status='approved' ORDER BY id DESC`).all();
        return Response.json({ok:true,data:res.results},headers);
      }catch(e){
        return Response.json({ok:false,msg:"服务端异常:"+e.message},headers);
      }
    }
    // 管理员：待审核文章
    if(action === "pendingText"){
      const pwd = url.searchParams.get("pwd");
      const ADMIN_PASSWORD = env.ADMIN_PASSWORD;
      if(pwd!==ADMIN_PASSWORD){
        return Response.json({ok:false,msg:"密码错误，无权访问"},headers);
      }
      const res = await env.DB.prepare(`SELECT id,title,content,cover,author,create_time FROM texts WHERE status='pending' ORDER BY id DESC`).all();
      return Response.json({ok:true,data:res.results},headers);
    }
    // 管理员：待审核帖子
    if(action === "pendingArticle"){
      const pwd = url.searchParams.get("pwd");
      const ADMIN_PASSWORD = env.ADMIN_PASSWORD;
      if(pwd!==ADMIN_PASSWORD){
        return Response.json({ok:false,msg:"密码错误，无权访问"},headers);
      }
      const res = await env.DB.prepare(`SELECT id,title,content,cover,author,create_time FROM articles WHERE status='pending' ORDER BY id DESC`).all();
      return Response.json({ok:true,data:res.results},headers);
    }
    // 获取单篇文章（接口先放着，页面后面再写）
    if(action === "getText"){
      const id = url.searchParams.get("id");
      const user = url.searchParams.get("username");
      const res = await env.DB.prepare(`
        SELECT t.*,
        (SELECT COUNT(*) FROM likes WHERE target_type='text' AND target_id=t.id AND username=?) AS userLiked
        FROM texts t WHERE id=? AND status='approved'
      `).bind(user,id).first();
      return Response.json({ok:true,data:res},headers);
    }
    // 获取单个帖子【增加userLiked查询】
    if(action === "getArticle"){
      const id = url.searchParams.get("id");
      const user = url.searchParams.get("username");
      const res = await env.DB.prepare(`
        SELECT a.*,
        (SELECT COUNT(*) FROM likes WHERE target_type='article' AND target_id=a.id AND username=?) AS userLiked
        FROM articles a WHERE id=? AND status='approved'
      `).bind(user,id).first();
      return Response.json({ok:true,data:res},headers);
    }
    // 获取帖子评论【增加每条评论的userLiked】
    if(action === "getComments"){
      const target_type = url.searchParams.get("type");
      const target_id = url.searchParams.get("id");
      const user = url.searchParams.get("username");
      const res = await env.DB.prepare(`
        SELECT c.*,
        (SELECT COUNT(*) FROM likes WHERE target_type='comment' AND target_id=c.id AND username=?) AS userLiked
        FROM comments c WHERE target_type=? AND target_id=? ORDER BY id DESC
      `).bind(user,target_type,target_id).all();
      return Response.json({ok:true,data:res.results},headers);
    }
  }
  // 兜底返回
  return Response.json({ok:false,msg:"未知action请求"},headers);
}
