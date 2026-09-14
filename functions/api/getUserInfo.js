export async function onRequest({request, env}){
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    const db = env.wenhui_users;
    const {results} = await db.prepare("SELECT username,age,job,bio FROM users WHERE username = ?").bind(username).all();
    if(results.length === 0){
        return Response.json({ok:false,msg:"用户不存在"})
    }
    return Response.json({ok:true,user:results[0]})
}
