// 自动注入悬浮侧边栏
(function(){
    // 插入样式
    const style = document.createElement('style');
    style.textContent = `
.left-sidebar{
    position: fixed;
    left:0;
    top:0;
    height:100vh;
    background:#ffffff;
    box-shadow:2px 0 8px rgba(0,0,0,0.06);
    width:60px;
    transition: width 0.25s ease;
    z-index:98;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    padding-top:53px;  /* 再次向下移动一格 */
}
.left-sidebar:hover{
    width:180px;
}
.left-nav-item{
    display:flex;
    align-items:center;
    gap:16px;
    padding:14px 16px;
    cursor:pointer;
    white-space:nowrap;
}
.left-nav-item:hover{
    background:#f7fafc;
}
.left-nav-item .icon{
    font-size:22px;
    width:24px;
    text-align:center;
}
.left-nav-item .text{
    opacity:0;
    transition: opacity 0.2s ease;
}
.left-sidebar:hover .text{
    opacity:1;
}
`;
    document.head.appendChild(style);

    // 侧边栏DOM
    const sidebar = document.createElement('div');
    sidebar.className = "left-sidebar";
    sidebar.innerHTML = `
    <div class="left-nav-item" onclick="location.href='/'"><span class="icon">🏠</span><span class="text">主页</span></div>
    <div class="left-nav-item" onclick="location.href='/articlelist.html'"><span class="icon">💬</span><span class="text">论坛广场</span></div>
    <div class="left-nav-item" onclick="location.href='/articleLibrary.html'"><span class="icon">📖</span><span class="text">文章库</span></div>
    <div class="left-nav-item" onclick="location.href='/rank.html'"><span class="icon">🏆</span><span class="text">排行榜</span></div>
    <div class="left-nav-item" onclick="location.href='contest.html'"><span class="icon">📝</span><span class="text">比赛广场</span></div>
    <div class="left-nav-item" onclick="location.href='/submit.html'"><span class="icon">📄</span><span class="text">文件投稿</span></div>
    <div class="left-nav-item"><span class="icon">💬</span><span class="text">讨论区</span></div>
    <div class="left-nav-item" onclick="location.href='/my-article.html'"><span class="icon">📝</span><span class="text">我的文章</span></div>
    `;
    document.body.prepend(sidebar);
})();
