// ChatbotWidget.js - July 2025, for fully dynamic embed config
(function () {
    if (window.ChatbotWidgetLoaded) return;
    window.ChatbotWidgetLoaded = true;

    // --- READ CONFIG ---
    const config = window.ChatWidgetConfig || {};
    const branding = config.branding || {};
    const styleCfg = config.style || {};

    const primaryColor = styleCfg.primaryColor || '#399be6';
    const secondaryColor = styleCfg.secondaryColor || primaryColor;
    const fontColor = styleCfg.fontColor || '#222f3e';
    const backgroundColor = styleCfg.backgroundColor || '#fff';
    const logo = branding.logo || '';
    const botName = branding.name || 'Your Bot';
    const welcomeText = branding.welcomeText || 'Welcome!';
    const responseTimeText = branding.responseTimeText || '';
    const position = styleCfg.position === 'left' ? 'left' : 'right';

    // --- FONT ---
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap';
    document.head.appendChild(fontLink);

    // --- STYLES ---
    const style = document.createElement('style');
    style.textContent = `
        .cbw-root { font-family: 'Poppins',sans-serif; position: fixed; z-index: 9999; }
        .cbw-launcher {
            position: fixed; bottom: 24px; ${position}: 24px; width: 60px; height: 60px;
            background: ${primaryColor}; border-radius: 50%; border: none; cursor: pointer;
            box-shadow: 0 8px 32px rgba(0,0,0,0.20); display: flex; align-items: center; justify-content: center;
            transition: background .2s;
        }
        .cbw-launcher svg { color: #fff; width: 30px; height: 30px; }
        .cbw-window {
            position: fixed; bottom: 96px; ${position}: 24px;
            width: 360px; height: 560px; background: ${backgroundColor}; border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            display: flex; flex-direction: column; overflow: hidden;
            opacity: 0; transform: scale(0.95) translateY(30px); pointer-events: none;
            transition: all 0.2s cubic-bezier(.4,0,.2,1);
        }
        .cbw-window.active { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
        .cbw-header {
            background: ${primaryColor}; color: #fff; padding: 20px; display: flex; align-items: center; gap: 14px;
        }
        .cbw-logo { width: 36px; height: 36px; border-radius: 50%; background: #fff; object-fit: cover; }
        .cbw-title { font-weight: 600; font-size: 18px; flex: 1; }
        .cbw-close { background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; }
        .cbw-welcome { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 48px 20px; }
        .cbw-welcome h2 { font-size: 23px; font-weight: 600; margin-bottom: 18px; color: ${fontColor}; }
        .cbw-welcome button {
            padding: 13px 24px; font-size: 16px; font-weight: 600; color: #fff;
            background: ${primaryColor}; border: none; border-radius: 10px; cursor: pointer; margin-bottom: 12px;
            display: flex; align-items: center; gap: 7px; transition: background 0.2s;
        }
        .cbw-welcome button:hover { background: ${secondaryColor}; }
        .cbw-welcome .cbw-rt { color: #888; font-size:14px; }
        .cbw-body { display: none; flex-direction: column; height: 100%; }
        .cbw-body.active { display: flex; flex: 1; }
        .cbw-messages { flex: 1; overflow-y: auto; padding: 20px 18px; display: flex; flex-direction: column; gap: 13px; background: #f9fafb; }
        .cbw-bubble { max-width: 80%; padding: 11px 16px; border-radius: 18px; font-size: 15px; line-height: 1.5; word-break: break-word; }
        .cbw-user { background: ${primaryColor}; color: #fff; align-self: flex-end; border-bottom-right-radius: 6px; }
        .cbw-bot { background: #e5e7eb; color: #22223b; align-self: flex-start; border-bottom-left-radius: 6px; }
        .cbw-controls { padding: 16px; border-top: 1px solid #eee; display: flex; gap: 9px; background: #fff; }
        .cbw-input {
            flex: 1; padding: 10px 15px; border-radius: 9px; border: 1px solid #ccc; font-size: 15px; outline: none; resize: none; min-height: 38px; max-height: 80px;
            font-family: inherit; line-height: 1.4;
        }
        .cbw-send {
            background: ${primaryColor}; color: #fff; border: none; border-radius: 9px; width: 42px; height: 42px; cursor: pointer;
            display: flex; align-items: center; justify-content: center; transition: background 0.2s;
        }
        .cbw-send:hover { background: ${secondaryColor}; }
        @media (max-width: 500px) {
            .cbw-window { width: 98vw; ${position}: 1vw; height: 60vh; min-height: 320px; }
        }
    `;
    document.head.appendChild(style);

    // --- DOM STRUCTURE ---
    const root = document.createElement('div');
    root.className = 'cbw-root';

    // Launcher button
    const launcher = document.createElement('button');
    launcher.className = 'cbw-launcher';
    launcher.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"></path></svg>`;
    root.appendChild(launcher);

    // Window
    const win = document.createElement('div');
    win.className = 'cbw-window';

    // Header
    const header = document.createElement('div');
    header.className = 'cbw-header';
    header.innerHTML = `
        <img class="cbw-logo" src="${logo}" alt="Bot" />
        <div class="cbw-title">${botName}</div>
        <button class="cbw-close">&times;</button>
    `;
    win.appendChild(header);

    // Welcome Screen (no form, just button)
    const welcome = document.createElement('div');
    welcome.className = 'cbw-welcome';
    welcome.innerHTML = `
        <h2>${welcomeText}</h2>
        <button class="cbw-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Start Chatting
        </button>
        <div class="cbw-rt">${responseTimeText || ''}</div>
    `;
    win.appendChild(welcome);

    // Chat Body
    const body = document.createElement('div');
    body.className = 'cbw-body';
    body.innerHTML = `
        <div class="cbw-messages"></div>
        <div class="cbw-controls">
            <textarea class="cbw-input" placeholder="Type your message..."></textarea>
            <button class="cbw-send">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
            </button>
        </div>
    `;
    win.appendChild(body);
    root.appendChild(win);
    document.body.appendChild(root);

    // --- ELEMENT REFS ---
    const closeBtn = header.querySelector('.cbw-close');
    const startBtn = welcome.querySelector('.cbw-start');
    const messagesDiv = body.querySelector('.cbw-messages');
    const input = body.querySelector('.cbw-input');
    const sendBtn = body.querySelector('.cbw-send');

    // --- EVENTS ---
    launcher.onclick = () => win.classList.toggle('active');
    closeBtn.onclick = () => win.classList.remove('active');
    startBtn.onclick = () => {
        welcome.style.display = 'none';
        body.classList.add('active');
        setTimeout(() => { input.focus(); }, 100);
    };

    // Send message (enter or button)
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        appendMessage(text, 'user');
        input.value = '';
        input.style.height = '38px';
        botReply(text);
    }
    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); sendMessage();
        }
    };

    // Auto-resize textarea
    input.oninput = () => {
        input.style.height = '38px';
        input.style.height = Math.min(input.scrollHeight, 80) + 'px';
    };

    // --- MESSAGING ---
    function appendMessage(msg, who = 'bot') {
        const bubble = document.createElement('div');
        bubble.className = `cbw-bubble cbw-${who}`;
        bubble.innerHTML = who === 'user' ? escapeHtml(msg) : linkify(msg);
        messagesDiv.appendChild(bubble);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    function escapeHtml(text) {
        const d = document.createElement('div'); d.textContent = text; return d.innerHTML;
    }
    function linkify(text) {
        return text.replace(/(https?:\/\/[^\s]+)/g, (url) => `<a href="${url}" target="_blank" style="color:${primaryColor};text-decoration:underline">${url}</a>`);
    }

    // --- API BOT REPLY ---
    async function botReply(msg) {
        appendTyping();
        // Connect to the backend webhook
        try {
            const webhookUrl = config.webhook && config.webhook.url;
            if (!webhookUrl) {
                throw new Error('Webhook URL not defined.');
            }
            const payload = {
                message: msg,
                source: 'widget'
            };
            const res = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            removeTyping();
            if (!res.ok) {
                appendMessage('Sorry, there was an error. Please try again.', 'bot');
                return;
            }
            const data = await res.json();
            appendMessage(data.reply || 'No response from bot.', 'bot');
        } catch (e) {
            removeTyping();
            appendMessage('Sorry, I could not connect to the bot service.', 'bot');
        }
    }
    // Typing indicator
    function appendTyping() {
        removeTyping();
        const tip = document.createElement('div');
        tip.className = 'cbw-bubble cbw-bot cbw-typing';
        tip.innerHTML = `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#bbb;animation:blink 1s infinite;"></span>
                         <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#bbb;animation:blink 1s 0.3s infinite;"></span>
                         <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#bbb;animation:blink 1s 0.6s infinite;"></span>`;
        messagesDiv.appendChild(tip);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    function removeTyping() {
        const tips = messagesDiv.querySelectorAll('.cbw-typing');
        tips.forEach(t => t.remove());
    }

    // --- BLINK KEYFRAME for Typing ---
    const typingStyle = document.createElement('style');
    typingStyle.textContent = `
        @keyframes blink {
            0%, 80%, 100% { opacity: .4; }
            40% { opacity: 1; }
        }
    `;
    document.head.appendChild(typingStyle);

})();
