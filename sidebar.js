// sidebar.js 统一注入：左侧悬浮侧边栏 + 右侧账号抽屉drawer + 登录注册弹窗
(function(){
    const style = document.createElement('style');
    style.textContent = `
/* --------左侧悬浮侧边栏-------- */
.left-sidebar{
    position: fixed;
    left:0;
    top:0;
    height:100vh;
    background:#ffffff;
    box-shadow:2px 0 8px rgba(0,0,0,0.06);
    width:60px;
    transition: width 0.25s ease;
    z-index:100;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    padding-top:48px;
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

/* --------右侧账号抽屉drawer-------- */
.drawer-mask{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.35);
    z-index:101;
    display:none;
}
.drawer{
    position:fixed;
    top:0;
    right:0;
    width:340px;
    height:100vh;
    background:#ffffff;
    box-shadow:-4px 0 16px rgba(0,0,0,0.08);
    z-index:102;
    transform:translateX(100%);
    transition:transform 0.25s ease;
    padding:24px;
}
.drawer.open{
    transform:translateX(0);
}
.drawer-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:24px;
}
.drawer-username{
    font-size:1.4rem;
    font-weight:bold;
    color:#3182ce;
}
.drawer-close{
    font-size:24px;
    cursor:pointer;
    color:#718096;
}
.drawer-menu-item{
    padding:14px 8px;
    font-size:1.05rem;
    cursor:pointer;
    border-radius:8px;
    display:flex;
    align-items:center;
    gap:12px;
}
.drawer-menu-item:hover{
    background:#f7fafc;
}
.drawer-divider{
    height:1px;
    background:#e2e8f0;
    margin:16px 0;
}

/* --------登录注册弹窗modal-------- */
.modal-wrap{
    display:none;
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.4);
    align-items:center;
    justify-content:center;
    z-index:103;
}
.modal{
    background:white;
    padding:32px;
    border-radius:12px;
    width:420px;
    max-width:90%;
}
.modal h2{
    margin-bottom:20px;
}
.modal input{
    width:100%;
    padding:12px;
    margin-bottom:14px;
    border:1px solid #cbd5e0;
    border-radius:8px;
    font-size:1rem;
}
.modal-footer{
    display:flex;
    gap:12px;
    margin-top:20px;
}
.btn-outline{
    background:transparent;
    border:1px solid #3182ce;
    color:#3182ce;
    padding:10px 22px;
    border-radius:8px;
    border:none;
    font-size:1rem;
    cursor:pointer;
}
.btn-outline:hover{
    background:#ebf8ff;
}
.btn-primary{
    background:#3182ce;
    color:white;
    padding:10px 22px;
    border-radius:8px;
    border:none;
    font-size:1rem;
    cursor:pointer;
}
.btn-primary:hover{
    background:#2b6cb0;
}
button:active{
    transform:scale(0.96);
}
`;
    document.head.appendChild(style);

    // ========== DOM 全部自动生成 ==========
    // 左侧侧边栏
    const sidebarEl = document.createElement('div');
    sidebarEl.className = "left-sidebar";
    sidebarEl.innerHTML = `
    <div class="left-nav-item" onclick="location.href='/'"><span class="icon">🏠</span><span class="text">主页</span></div>
    <div class="left-nav-item" onclick="location.href='/articlelist.html'"><span class="icon">💬</span><span class="text">论坛广场</span></div>
    <div class="left-nav-item" onclick="location.href='/articleLibrary.html'"><span class="icon">📖</span><span class="text">文章库</span></div>
    <div class="left-nav-item" onclick="location.href='/rank.html'"><span class="icon">🏆</span><span class="text">排行榜</span></div>
    <div class="left-nav-item" onclick="location.href='contest.html'"><span class="icon">📝</span><span class="text">比赛广场</span></div>
    <div class="left-nav-item" onclick="location.href='/submit.html'"><span class="icon">📄</span><span class="text">文件投稿</span></div>
    <div class="left-nav-item"><span class="icon">💬</span><span class="text">讨论区</span></div>
    <div class="left-nav-item" onclick="location.href='/my-article.html'"><span class="icon">📝</span><span class="text">我的文章</span></div>
    `;
    document.body.prepend(sidebarEl);

    // 右侧抽屉mask + drawer
    const drawerMask = document.createElement('div');
    drawerMask.className = "drawer-mask";
    document.body.appendChild(drawerMask);

    const drawer = document.createElement('div');
    drawer.className = "drawer";
    drawer.innerHTML = `
<div class="drawer-header">
    <div class="drawer-username" id="drawerName">username</div>
    <div class="drawer-close">×</div>
</div>
<div class="drawer-menu-item" data-href="/profile.html">👤 个人主页</div>
<div class="drawer-menu-item" onclick="location.href='/my-article.html'">📝 我的文章</div>
<div class="drawer-menu-item" onclick="alert('偏好设置页面（待开发）')">⚙️ 偏好设置</div>
<div class="drawer-divider"></div>
<div class="drawer-menu-item" id="logoutBtn">🚪 登出账号</div>
    `;
    document.body.appendChild(drawer);

    // 登录弹窗
    const loginModal = document.createElement('div');
    loginModal.className = "modal-wrap";
    loginModal.innerHTML = `
<div class="modal">
    <h2>登录账号</h2>
    <input type="text" placeholder="用户名" id="loginUser">
    <input type="password" placeholder="密码" id="loginPwd">
    <div class="modal-footer">
        <button class="btn-outline" id="closeLogin">取消</button>
        <button class="btn-primary" id="confirmLogin">登录</button>
    </div>
</div>
    `;
    document.body.appendChild(loginModal);

    // 注册弹窗
    const regModal = document.createElement('div');
    regModal.className = "modal-wrap";
    regModal.innerHTML = `
<div class="modal">
    <h2>创建账号</h2>
    <input type="text" placeholder="设置用户名" id="regUser">
    <input type="text" placeholder="邮箱（选填）" id="regEmail">
    <input type="password" placeholder="设置密码" id="regPwd">
    <input type="password" placeholder="确认密码" id="regPwd2">
    <div class="modal-footer">
        <button class="btn-outline" id="closeReg">取消</button>
        <button class="btn-primary" id="confirmReg">注册</button>
    </div>
</div>
    `;
    document.body.appendChild(regModal);

    // ========== 全局函数挂载到window，页面内onclick可以调用 ==========
    window.openModal = function(dom){ dom.style.display="flex"; };
    window.closeModal = function(dom){ dom.style.display="none"; };

    window.openDrawer = function(){
        const uname = localStorage.getItem("username");
        document.getElementById("drawerName").innerText = uname||"";
        drawer.classList.add("open");
        drawerMask.style.display = "block";
    };
    window.closeDrawer = function(){
        drawer.classList.remove("open");
        drawerMask.style.display = "none";
    };

    // 绑定抽屉事件
    drawer.querySelector('.drawer-close').onclick = closeDrawer;
    drawerMask.onclick = closeDrawer;
    drawer.querySelectorAll('.drawer-menu-item[data-href]').forEach(item=>{
        item.onclick = function(){
            location.href = this.dataset.href;
            closeDrawer();
        }
    });
    drawer.querySelector('#logoutBtn').onclick = function(){
        localStorage.removeItem("username");
        localStorage.removeItem("uid");
        closeDrawer();
        location.reload();
    };

    // 弹窗关闭按钮
    document.getElementById('closeLogin').onclick = ()=> closeModal(loginModal);
    document.getElementById('closeReg').onclick = ()=> closeModal(regModal);

    // 登录按钮
    document.getElementById('confirmLogin').onclick = async function(){
        const username = document.getElementById('loginUser').value.trim();
        const password = document.getElementById('loginPwd').value;
        const res = await fetch(`/api/login`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username,password})
        });
        const data = await res.json();
        alert(data.msg);
        if(data.ok){
            localStorage.setItem("uid",data.uid);
            localStorage.setItem("username",data.username);
            closeModal(loginModal);
            location.reload();
        }
    };

    // 注册按钮
    document.getElementById('confirmReg').onclick = async function(){
        const user = document.getElementById('regUser').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const pwd1 = document.getElementById('regPwd').value;
        const pwd2 = document.getElementById('regPwd2').value;
        if(pwd1 !== pwd2){
            alert("两次密码不一致！");
            return;
        }
        const res = await fetch(`/api/register`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username:user,password:pwd1,email:email})
        });
        const data = await res.json();
        alert(data.msg);
        if(data.ok){
            closeModal(regModal);
        }
    };

    // ========== 渲染导航栏（页面navArea容器需要存在，id="navArea"） ==========
    function renderNav(){
        const navAreaDom = document.getElementById("navArea");
        if(!navAreaDom) return;
        const username = localStorage.getItem("username");
        if(username){
            navAreaDom.innerHTML = `
<div class="avatar-box" id="avatarWrap" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
    <div class="avatar" style="width:40px;height:40px;border-radius:50%;background:#3182ce;color:white;display:grid;place-items:center;font-weight:bold;font-size:18px;">${username[0]}</div>
    <span>${username}</span>
</div>`;
            document.getElementById("avatarWrap").onclick = openDrawer;
        }else{
            navAreaDom.innerHTML = `
<button class="btn-outline" id="loginBtn">登录账号</button>
<button class="btn-primary" id="registerBtn">创建账号</button>
`;
            document.getElementById('loginBtn').onclick = ()=> openModal(loginModal);
            document.getElementById('registerBtn').onclick = ()=> openModal(regModal);
        }
    }
    // DOM加载完渲染导航
    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded",renderNav);
    }else{
        renderNav();
    }
})();
