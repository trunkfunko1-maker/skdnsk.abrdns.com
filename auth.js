(function() {
    const EXCLUDED_GAMES = ["game.html", "tetris", "snake"];
    const currentPath = window.location.pathname.toLowerCase();
    const isGame = EXCLUDED_GAMES.some(g => currentPath.includes(g.toLowerCase()));
    if (isGame) return;

    const CSS = `
        html, body, .wrapper, .container, .main-content, #content, main, section, article, .markdown-body {
            background-color: #121212 !important; color: #e0e0e0 !important; margin-top: 0 !important; padding-top: 0 !important;
        }
        p, span, li, td, th, em, strong, label { color: #e0e0e0 !important; }
        h1, h2, h3, h4, h5, h6 { color: #ffffff !important; border-bottom: 1px solid #2d2d2d !important; padding-bottom: 8px; }
        body a { color: #64b5f6 !important; }
        body .navbar { background-color: #1e1e1e !important; border: 1px solid #2d2d2d !important; padding: 12px !important; border-radius: 8px; margin-bottom: 20px; display: flex !important; justify-content: space-around !important; }
        body .navbar a { color: #b0bec5 !important; margin: 0 12px !important; text-decoration: none !important; font-weight: bold !important; }
        img { border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
        body button { background: linear-gradient(180deg,#424242,#212121) !important; color:#fff !important; border:1px solid #4d4d4d !important; border-radius:25px !important; font-weight:bold !important; cursor:pointer !important; }
        body footer { background:#1e1e1e !important; color:#90a4ae !important; text-align:center !important; padding:20px !important; margin-top:50px !important; border-top:1px solid #2d2d2d !important; }
    `;
    const inject = () => {
        const s = document.createElement('style');
        s.textContent = CSS;
        document.head.appendChild(s);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
    else inject();

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.page-header, #header_wrap, .site-header, .site-title, .project-name, .project-tagline').forEach(el => el.remove());
        const nav = document.createElement('div');
        nav.innerHTML = `
            <div class="navbar"><a href="/index.html">首页</a><a href="/contact.html">联系</a><a href="/23.html">关于</a></div>
            <div class="navbar"><a href="/24.html">王茂钢</a><a href="/25.html">异闻录</a><a href="/22.html">怪物鸡吧</a></div>
        `;
        document.body.insertBefore(nav, document.body.firstChild);
        const footer = document.createElement('footer');
        footer.innerHTML = `<p>© 2026 川大附中天堂网</p><p><a href="mailto:djkenfisao@proton.me" style="color:#64b5f6;">发送投稿</a></p><p><a href="/contact.html" style="color:#64b5f6;">联系我</a></p>`;
        document.body.appendChild(footer);
    });
})();
