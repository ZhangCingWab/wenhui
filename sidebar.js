(function () {
    function initSidebar() {
        if (document.getElementById('sidebar-root-style')) return;

        const style = document.createElement('style');
        style.id = 'sidebar-root-style';
        style.textContent = `
#sidebar-left {
    position: fixed !important;
    z-index: 98 !important;
}
#sidebar-drawer-mask,
#sidebar-drawer,
#sidebar-login-modal,
#sidebar-reg-modal {
    position: fixed !important;
    z-index: 99999 !important;
}

/* --------左侧悬浮侧边栏：top:64px-------- */
#sidebar-left {
    left: 0;
    top: 64px;
    bottom:0;
    width: 60px;
    background: #ffffff !important;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.12) !important;
    transition: width 0.25s ease;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-right: 1px solid #e2e8f0;
    overflow-y:auto;
}

#sidebar-left:hover {
    width: 220px;
}

.sidebar-left-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    cursor: pointer;
    white-space: nowrap;
    color: #2d3748;
    font-size: 1rem;
}

.sidebar-left-item:hover {
    background: #f0f7ff;
}

.sidebar-left-item .icon {
    font-size: 22px;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
}

.sidebar-left-item .text {
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
}

#sidebar-left:hover .text {
    opacity: 1;
    pointer-events: auto;
}

/* -------- 右侧抽屉遮罩 -------- */
#sidebar-drawer-mask {
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: none;
}
#sidebar-drawer-mask.active { display: block; }

/* -------- 账号抽屉 -------- */
#sidebar-drawer {
    top: 0;
    right: 0;
    width: 340px;
    max-width: 86vw;
    height: 100vh;
    background: #ffffff !important;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.18) !important;
    transform: translateX(100%);
    transition: transform 0.25s ease;
    padding: 24px;
    overflow-y: auto;
    border-left: 1px solid #e2e8f0;
}
#sidebar-drawer.open { transform: translateX(0); }

.sidebar-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}
.sidebar-drawer-username {
    font-size: 1.4rem;
    font-weight: bold;
    color: #3182ce;
}
.sidebar-drawer-close {
    font-size: 26px;
    cursor: pointer;
    color: #718096;
    user-select: none;
}
.sidebar-drawer-item {
    padding: 14px 12px;
    font-size: 1.05rem;
    cursor: pointer;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #2d3748;
}
.sidebar-drawer-item:hover { background: #f0f7ff; }
.sidebar-drawer-divider {
    height: 1px;
    background: #e2e8f0;
    margin: 16px 0;
}

/* -------- 登录注册弹窗 -------- */
.sidebar-modal-wrap {
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
}
.sidebar-modal-wrap.active { display: flex; }
.sidebar-modal {
    background: #ffffff;
    padding: 28px;
    border-radius: 14px;
    width: 440px;
    max-width: 92vw;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}
.sidebar-modal h2 { margin-bottom: 18px; color: #2d3748; }
.sidebar-modal input {
    width: 100%;
    padding: 12px 14px;
    margin-bottom: 14px;
    border: 1px solid #cbd5e0;
    border-radius: 10px;
    font-size: 1rem;
    outline: none;
    box-sizing: border-box;
}
.sidebar-modal input:focus {
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.15);
}
.sidebar-modal-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 20px;
}
.sidebar-btn {
    padding: 10px 22px;
    border-radius: 10px;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
}
.sidebar-btn:active { transform: scale(0.96); }
.sidebar-btn-outline {
    background: transparent;
    border: 1px solid #3182ce;
    color: #3182ce;
}
.sidebar-btn-outline:hover { background: #ebf8ff; }
.sidebar-btn-primary {
    background: #3182ce;
    color: #ffffff;
}
.sidebar-btn-primary:hover { background: #2b6cb0; }

/* -------- 导航栏头像盒子 -------- */
#sidebar-avatar-box {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
}
#sidebar-avatar-box .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #3182ce;
    color: #ffffff;
    display: grid;
    place-items: center;
    font-weight: bold;
    font-size: 18px;
}
        `;
        document.head.appendChild(style);

        // 侧边栏DOM
        const sidebar = document.createElement('div');
        sidebar.id = 'sidebar-left';
        sidebar.innerHTML = `
            <div class="sidebar-left-item" data-href="/">
                <span class="icon">🏠</span>
                <span class="text">主页</span>
            </div>
            <div class="sidebar-left-item" data-href="/articlelist.html">
                <span class="icon">💬</span>
                <span class="text">论坛广场</span>
            </div>
            <div class="sidebar-left-item" data-href="/articleLibrary.html">
                <span class="icon">📖</span>
                <span class="text">文章库</span>
            </div>
            <div class="sidebar-left-item" data-href="/rank.html">
                <span class="icon">🏆</span>
                <span class="text">排行榜</span>
            </div>
            <div class="sidebar-left-item" data-href="/contest.html">
                <span class="icon">📝</span>
                <span class="text">比赛广场</span>
            </div>
            <div class="sidebar-left-item" data-href="/submit.html">
                <span class="icon">📄</span>
                <span class="text">文件投稿</span>
            </div>
            <div class="sidebar-left-item" data-href="/my-article.html">
                <span class="icon">📝</span>
                <span class="text">我的文章</span>
            </div>
        `;
        document.body.appendChild(sidebar);

        // 侧边栏菜单点击
        sidebar.querySelectorAll('.sidebar-left-item').forEach(item => {
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                const href = this.getAttribute('data-href');
                if (href) location.href = href;
            });
        });

        // 抽屉遮罩 & 抽屉
        const drawerMask = document.createElement('div');
        drawerMask.id = 'sidebar-drawer-mask';
        document.body.appendChild(drawerMask);

        const drawer = document.createElement('div');
        drawer.id = 'sidebar-drawer';
        drawer.innerHTML = `
            <div class="sidebar-drawer-header">
                <div class="sidebar-drawer-username" id="sidebar-drawer-name">username</div>
                <div class="sidebar-drawer-close" id="sidebar-drawer-close">×</div>
            </div>
            <div class="sidebar-drawer-item" data-href="/profile.html">👤 个人主页</div>
            <div class="sidebar-drawer-item" data-href="/my-article.html">📝 我的文章</div>
            <div class="sidebar-drawer-item" data-href="/settings.html">⚙️ 偏好设置</div>
            <div class="sidebar-drawer-divider"></div>
            <div class="sidebar-drawer-item" id="sidebar-logout-btn">🚪 登出账号</div>
        `;
        document.body.appendChild(drawer);

        // 登录弹窗
        const loginModal = document.createElement('div');
        loginModal.id = 'sidebar-login-modal';
        loginModal.className = 'sidebar-modal-wrap';
        loginModal.innerHTML = `
            <div class="sidebar-modal">
                <h2>登录账号</h2>
                <input type="text" placeholder="用户名" id="sidebar-login-user">
                <input type="password" placeholder="密码" id="sidebar-login-pwd">
                <div class="sidebar-modal-footer">
                    <button class="sidebar-btn sidebar-btn-outline" id="sidebar-close-login">取消</button>
                    <button class="sidebar-btn sidebar-btn-primary" id="sidebar-confirm-login">登录</button>
                </div>
            </div>
        `;
        document.body.appendChild(loginModal);

        // 注册弹窗
        const regModal = document.createElement('div');
        regModal.id = 'sidebar-reg-modal';
        regModal.className = 'sidebar-modal-wrap';
        regModal.innerHTML = `
            <div class="sidebar-modal">
                <h2>创建账号</h2>
                <input type="text" placeholder="设置用户名" id="sidebar-reg-user">
                <input type="text" placeholder="邮箱（选填）" id="sidebar-reg-email">
                <input type="password" placeholder="密码" id="sidebar-reg-pwd">
                <input type="password" placeholder="确认密码" id="sidebar-reg-pwd2">
                <div class="sidebar-modal-footer">
                    <button class="sidebar-btn sidebar-btn-outline" id="sidebar-close-reg">取消</button>
                    <button class="sidebar-btn sidebar-btn-primary" id="sidebar-confirm-reg">注册</button>
                </div>
            </div>
        `;
        document.body.appendChild(regModal);

        // ========== 全局函数（修复焦点问题） ==========
        window.sidebarOpenModal = function (dom, e) {
            if (e) e.stopPropagation();
            if (dom) dom.classList.add('active');
            document.activeElement.blur();
        };
        window.sidebarCloseModal = function (dom, e) {
            if (e) e.stopPropagation();
            if (dom) dom.classList.remove('active');
        };
        window.sidebarOpenDrawer = function (e) {
            if (e) e.stopPropagation();
            const uname = localStorage.getItem('username') || '未登录';
            document.getElementById('sidebar-drawer-name').textContent = uname;
            drawer.classList.add('open');
            drawerMask.classList.add('active');
            document.activeElement.blur();
        };
        window.sidebarCloseDrawer = function (e) {
            if (e) e.stopPropagation();
            drawer.classList.remove('open');
            drawerMask.classList.remove('active');
        };

        // ========== 抽屉内事件 ==========
        document.getElementById('sidebar-drawer-close').addEventListener('click', function (e) {
            e.stopPropagation();
            sidebarCloseDrawer(e);
        });
        drawerMask.addEventListener('click', function (e) {
            e.stopPropagation();
            sidebarCloseDrawer(e);
        });
        drawer.querySelectorAll('.sidebar-drawer-item[data-href]').forEach(item => {
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                const href = this.getAttribute('data-href');
                if (href) location.href = href;
                sidebarCloseDrawer(e);
            });
        });
        document.getElementById('sidebar-logout-btn').addEventListener('click', function (e) {
            e.stopPropagation();
            localStorage.removeItem('username');
            localStorage.removeItem('uid');
            sidebarCloseDrawer(e);
            location.reload();
        });

        // ========== 登录注册弹窗事件 ==========
        document.getElementById('sidebar-close-login').addEventListener('click', function (e) {
            e.stopPropagation();
            sidebarCloseModal(loginModal, e);
        });
        document.getElementById('sidebar-close-reg').addEventListener('click', function (e) {
            e.stopPropagation();
            sidebarCloseModal(regModal, e);
        });
        document.getElementById('sidebar-confirm-login').addEventListener('click', async function (e) {
            e.stopPropagation();
            const username = document.getElementById('sidebar-login-user').value.trim();
            const password = document.getElementById('sidebar-login-pwd').value;
            if (!username || !password) {
                alert('请输入用户名和密码');
                return;
            }
            try {
                const res = await fetch('/api?action=login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                alert(data.msg || '登录请求已发送');
                if (data.ok) {
                    localStorage.setItem('uid', data.uid);
                    localStorage.setItem('username', data.username);
                    sidebarCloseModal(loginModal, e);
                    location.reload();
                }
            } catch (err) {
                alert('登录失败，请检查接口');
                console.error(err);
            }
        });
        document.getElementById('sidebar-confirm-reg').addEventListener('click', async function (e) {
            e.stopPropagation();
            const user = document.getElementById('sidebar-reg-user').value.trim();
            const email = document.getElementById('sidebar-reg-email').value.trim();
            const pwd1 = document.getElementById('sidebar-reg-pwd').value;
            const pwd2 = document.getElementById('sidebar-reg-pwd2').value;
            if (!user || !pwd1) {
                alert('用户名和密码不能为空');
                return;
            }
            if (pwd1 !== pwd2) {
                alert('两次密码不一致！');
                return;
            }
            try {
                const res = await fetch('/api?action=register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pwd1, email: email })
                });
                const data = await res.json();
                alert(data.msg || '注册请求已发送');
                if (data.ok) {
                    sidebarCloseModal(regModal, e);
                }
            } catch (err) {
                alert('注册失败，请检查接口');
                console.error(err);
            }
        });

        // 渲染导航栏登录/头像
        function renderNav() {
            const nav = document.querySelector("nav");
            if (!nav) {
                console.warn("页面没有nav标签，跳过渲染导航栏头像");
                return;
            }
            const children = Array.from(nav.children);
            const hasOtherContent = children.some(el => !el.classList.contains("logo") && el.textContent.trim() !== "");
            if (hasOtherContent) {
                console.log("nav已有其他内容，跳过头像渲染");
                return;
            }
            let navArea = document.createElement("div");
            nav.appendChild(navArea);
            const username = localStorage.getItem('username');
            if (username) {
                navArea.innerHTML = `
                    <div id="sidebar-avatar-box">
                        <div class="avatar">${username.charAt(0).toUpperCase()}</div>
                        <span style="color:#2d3748;">${username}</span>
                    </div>
                `;
                document.getElementById('sidebar-avatar-box').addEventListener('click', function (e) {
                    e.stopPropagation();
                    sidebarOpenDrawer(e);
                });
            } else {
                navArea.innerHTML = `
                    <button class="sidebar-btn sidebar-btn-outline" id="sidebar-login-btn">登录账号</button>
                    <button class="sidebar-btn sidebar-btn-primary" id="sidebar-register-btn">创建账号</button>
                `;
                document.getElementById('sidebar-login-btn').addEventListener('click', function (e) {
                    e.stopPropagation();
                    sidebarOpenModal(loginModal, e);
                });
                document.getElementById('sidebar-register-btn').addEventListener('click', function (e) {
                    e.stopPropagation();
                    sidebarOpenModal(regModal, e);
                });
            }
        }
        renderNav();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }
})();
