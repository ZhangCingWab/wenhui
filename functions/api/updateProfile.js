export async function onRequest({request, env}){
    const {username,age,job,bio} = await request.json();
    const db = env.wenhui_users;
    await db.prepare(`UPDATE users SET age=?,job=?,bio=? WHERE username=?`).bind(age,job,bio,username).run();
    return Response.json({ok:true,msg:"资料保存成功！"})
}
