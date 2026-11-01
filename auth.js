// auth.js
(function() {
    // 🚪 核心机制：利用 sessionStorage 判定是否为全新窗口
    // sessionStorage 在刷新、站内跳转时不会丢失；只有关闭标签页或新开标签页才会清空。
    if (!sessionStorage.getItem('site_auth_active')) {
        if (window.location.search.includes('logged_in=1')) {
            // 1. 刚登录成功跳转回来，打上已登录标记，抹掉网址后缀
            sessionStorage.setItem('site_auth_active', '1');
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (!window.location.search.includes('logout=1')) {
            // 2. 如果是新开的标签页或直接输网址，强制退登
            window.location.replace('/?logout=1');
            return; 
        }
    }

    // ---- 以下为你原本的 UI 渲染逻辑 ----
    const EXCLUDED_GAMES = ["game", "tetris", "snake"];
    const currentPath = window.location.pathname.toLowerCase();
    const isGame = EXCLUDED_GAMES.some(g => currentPath.includes(g));
    if (isGame) return;

    const MYSTERIOUS_THEME_CSS = `
        .page-header, #header_wrap, .site-header, .site-title, .project-name, .project-tagline, .downloads {
            display: none !important; height: 0 !important; min-height: 0 !important; max-height: 0 !important;
            padding: 0 !important; margin: 0 !important; border: none !important; position: absolute !important; top: -9999px !important;
        }
        html, body, .wrapper, .container, .main-content, #content, main, section, article, .markdown-body, .contact-container {
            background-color: #121212 !important; color: #e0e0e0 !important; margin-top: 0 !important; padding-top: 0 !important;
        }
        p, span, li, td, th, em, strong, label { color: #e0e0e0 !important; }
        h1, h2, h3, h4, h5, h6 { color: #ffffff !important; border-bottom: 1px solid #2d2d2d !important; padding-bottom: 8px; }
        body a { color: #64b5f6 !important; }
        body a:hover { color: #90caf9 !important; }
        body .navbar {
            background-color: #1e1e1e !important; border: 1px solid #2d2d2d !important; border-bottom: 2px solid #3d3d3d !important;
            padding: 12px !important; border-radius: 8px; margin-bottom: 20px; display: flex !important; justify-content: space-around !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }
        body .navbar a { color: #b0bec5 !important; margin: 0 12px !important; text-decoration: none !important; font-weight: bold !important; transition: color 0.2s ease; }
        body .navbar a:hover { color: #ffffff !important; }
        img { border-radius: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8); border: 1px solid #2d2d2d; }
        video { border: 1px solid #2d2d2d; background-color: #000000; }
        body button, body input[type="submit"] {
            background: linear-gradient(180deg, #424242 0%, #212121 100%) !important; color: #ffffff !important; border: 1px solid #4d4d4d !important; border-radius: 25px !important;
            font-weight: bold !important; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6) !important; cursor: pointer !important; transition: all 0.2s ease !important;
        }
        body button:hover { background: linear-gradient(180deg, #616161 0%, #212121 100%) !important; transform: scale(1.03); border-color: #64b5f6 !important; }
        body footer { background: #1e1e1e !important; color: #90a4ae !important; text-align: center !important; padding: 20px !important; margin-top: 50px !important; border-top: 1px solid #2d2d2d !important; border-radius: 8px !important; box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3); }
    `;

    const injectStyles = () => {
        const styleElement = document.createElement('style');
        styleElement.appendChild(document.createTextNode(MYSTERIOUS_THEME_CSS));
        document.head.appendChild(styleElement);
    };
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', injectStyles); } else { injectStyles(); }

    document.addEventListener('DOMContentLoaded', function() {
        const targetKillList = ['.page-header', '#header_wrap', '.site-header', '.site-title', '.project-name', '.project-tagline'];
        targetKillList.forEach(function(selector) {
            document.querySelectorAll(selector).forEach(function(el) { if (el) el.remove(); });
        });

        const navbarContainer = document.createElement('div');
        navbarContainer.innerHTML = `
            <div class="navbar">
                <a href="/index.html">首页</a>
                <a href="/contact.html">联系</a>
                <a href="/23.html">关于</a>
            </div>
            <div class="navbar">
                <a href="/24.html">王茂钢</a>
                <a href="/25.html">异闻录</a>
                <a href="/22.html">怪物鸡吧</a>
            </div>
        `;
        document.body.insertBefore(navbarContainer, document.body.firstChild);

        const footerElement = document.createElement('footer');
        footerElement.innerHTML = `
            <p>© 2026 川大附中天堂网 </p>
            <p><a href="mailto:djkenfisao@proton.me" style="color: #64b5f6;">发送投稿</a></p>
            <p><a href="/contact.html" style="color: #64b5f6;">联系我</a></p>
        `;
        document.body.appendChild(footerElement);
    });
})();
