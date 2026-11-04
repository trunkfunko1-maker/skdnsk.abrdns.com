// auth.js
(function() {
    // 🖼️ 背景图直链
    const BG_IMAGE_URL = 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920&auto=format&fit=crop'; 
    
    const EXCLUDED_GAMES = ["game", "tetris", "snake"];
    const currentPath = window.location.pathname.toLowerCase();
    const isGame = EXCLUDED_GAMES.some(g => currentPath.includes(g));
    if (isGame) return;

    // 拦截机制
    if (!sessionStorage.getItem('site_auth_active')) {
        if (window.location.search.includes('logged_in=1')) {
            sessionStorage.setItem('site_auth_active', '1');
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (window.location.search.includes('logout=1')) {
            return;
        } else {
            const isInternalNav = document.referrer && document.referrer.includes(window.location.host);
            if (isInternalNav) {
                sessionStorage.setItem('site_auth_active', '1');
            } else {
                window.location.replace('/?logout=1');
                return;
            }
        }
    }

    // 全新高舒适度暗黑毛玻璃主题 CSS
    const MYSTERIOUS_THEME_CSS = `
        /* 修复滑动闪白：给 html 和 body 铺满暗色底 */
        html {
            background-color: #0f0c20 !important;
            min-height: 100vh;
        }
        body {
            background-color: transparent !important;
            color: #e2e8f0 !important;
            margin: 0 !important;
            padding: 15px !important; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
            position: relative;
        }
        
        /* 🎯 核心修复：使用固定伪元素做背景，避免移动端 background-attachment 的渲染 Bug */
        body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-image: url('${BG_IMAGE_URL}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            z-index: -1;
            will-change: transform;
            transform: translateZ(0);
        }

        .page-header, #header_wrap, .site-header, .site-title, .project-name, .project-tagline, .downloads {
            display: none !important; height: 0 !important; margin: 0 !important; padding: 0 !important;
        }

        .wrapper, .container, .main-content, #content, main, section, article, .markdown-body, .contact-container {
            background: rgba(20, 22, 28, 0.85) !important; 
            backdrop-filter: blur(12px) !important; 
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            border-radius: 16px !important;
            padding: 20px !important;
            margin: 0 auto !important;
            max-width: 900px !important;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6) !important;
        }
        .markdown-body > *:first-child, 
        article > *:first-child, 
        main > *:first-child, 
        h1:first-of-type { 
            margin-top: 0 !important; 
        }

        p, span, li, td, th, em, strong, label { color: #cbd5e1 !important; line-height: 1.8; }
        h1, h2, h3, h4, h5, h6 { 
            color: #ffffff !important; 
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; 
            padding-bottom: 10px;
            margin-top: 1em;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        body a { color: #60a5fa !important; text-decoration: none; transition: all 0.2s; }
        body a:hover { color: #93c5fd !important; text-shadow: 0 0 8px rgba(96, 165, 250, 0.5); }
        body button, body input[type="submit"] {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important; 
            color: #ffffff !important; 
            border: none !important; 
            border-radius: 12px !important;
            padding: 10px 20px;
            font-weight: bold !important; 
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3) !important; 
            cursor: pointer !important; 
            transition: all 0.2s ease !important;
        }
        body button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5) !important; }
        
        img, video, iframe {
            max-width: 100% !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
            margin: 15px auto;
            display: block;
            transition: transform 0.3s ease;
        }
        img:hover { transform: scale(1.02); }
        
        body .navbar {
            background: rgba(30, 34, 42, 0.9) !important; 
            border: 1px solid rgba(255, 255, 255, 0.1) !important; 
            padding: 10px !important; 
            border-radius: 12px; 
            margin-bottom: 15px; 
            display: flex !important; 
            justify-content: space-around !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        body .navbar a { color: #94a3b8 !important; margin: 0 5px !important; font-size: 14px !important; }
        body .navbar a:hover { color: #ffffff !important; }
        
        /* 🎯 修复输入框溢出：加入 box-sizing: border-box */
        input[type="text"], input[type="password"], textarea {
            background: rgba(0, 0, 0, 0.5) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            color: #ffffff !important;
            border-radius: 8px !important;
            padding: 12px !important;
            transition: border-color 0.2s;
            box-sizing: border-box !important; 
            width: 100% !important;
        }
        input:focus, textarea:focus { border-color: #60a5fa !important; outline: none; }
        
        body footer { 
            text-align: center !important; 
            padding: 20px 0 !important; 
            margin-top: 30px !important; 
            border-top: 1px solid rgba(255, 255, 255, 0.1) !important; 
            color: #64748b !important;
            font-size: 13px;
        }
        body footer a { color: #64748b !important; margin: 0 5px; }
        body footer a:hover { color: #94a3b8 !important; }
        
        @media (max-width: 600px) {
            body { padding: 10px !important; }
            .wrapper, .container, .main-content, #content, main, section, article, .markdown-body {
                padding: 15px !important; 
                border-radius: 12px !important;
            }
            h1 { font-size: 22px !important; }
            h2 { font-size: 18px !important; }
            img, video { width: 100% !important; margin: 10px 0; }
            body .navbar { padding: 8px !important; border-radius: 10px; }
            body .navbar a { font-size: 13px !important; margin: 0 2px !important; }
        }
    `;

    const injectStyles = () => {
        const styleElement = document.createElement('style');
        styleElement.appendChild(document.createTextNode(MYSTERIOUS_THEME_CSS));
        document.head.appendChild(styleElement);
    };
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', injectStyles); } else { injectStyles(); }

    // 注入导航栏与页脚
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
        const firstContent = document.querySelector('.wrapper, .container, .main-content, article') || document.body.firstChild;
        document.body.insertBefore(navbarContainer, firstContent);

        const footerElement = document.createElement('footer');
        footerElement.innerHTML = `
            <p>© 2026 川大附中天堂网</p>
            <p><a href="mailto:djkenfisao@proton.me">发送投稿</a> · <a href="/contact.html">联系我</a></p>
        `;
        document.body.appendChild(footerElement);
    });
})();
