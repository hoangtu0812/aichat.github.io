/* Simple embeddable chat widget for n8n webhook (text + Vietnamese voice) */
(function () {
  const OPTIONS = {
    // webhookUrl: 'https://ai-assistant.bsr.com.vn:5678/webhook/ca181ac5-1b33-4e41-bc32-9b2e07347f3f/chat',
    webhookUrl: 'https://bsrassistant-bsrqn.msappproxy.net/webhook/ca181ac5-1b33-4e41-bc32-9b2e07347f3f/chat',
    title: 'Trợ lý ảo AI (Bản thử nghiệm)',
    lang: 'vi-VN',
    primaryColor: '#16a34a' 
  };

  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.textContent = `
  * {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  #n8n-embed-toggle {
    position: fixed; bottom: 24px; right: 24px;
    width: 60px; height: 60px; border-radius: 50%;
    background: linear-gradient(135deg, ${OPTIONS.primaryColor} 0%, #15803d 100%);
    color: #fff; border: none; cursor: pointer;
    box-shadow: 0 8px 24px rgba(22, 163, 74, 0.4);
    font-size: 24px;
    z-index: 10000;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex; align-items: center; justify-content: center;
  }
  #n8n-embed-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 32px rgba(22, 163, 74, 0.5);
  }
  #n8n-embed-toggle:active {
    transform: scale(0.95);
  }
  #n8n-embed-box {
    position: fixed; bottom: 100px; right: 24px;
    width: 380px; height: 600px; max-height: 80vh;
    background: #fff; border: none; border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
    display: none; flex-direction: column; overflow: hidden; z-index: 9999;
    animation: n8n-slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  @keyframes n8n-slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  #n8n-embed-header {
    padding: 18px 20px;
    background: linear-gradient(135deg, ${OPTIONS.primaryColor} 0%, #15803d 100%);
    color: #fff; font-weight: 600; font-size: 16px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-family: inherit;
  }
  #n8n-embed-header-logo {
    width: 28px;
    height: 28px;
    object-fit: contain;
    flex-shrink: 0;
  }
  #n8n-embed-messages {
    padding: 20px;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.6;
    background: #fafbfc;
    scroll-behavior: smooth;
  }
  #n8n-embed-messages::-webkit-scrollbar {
    width: 6px;
  }
  #n8n-embed-messages::-webkit-scrollbar-track {
    background: transparent;
  }
  #n8n-embed-messages::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  #n8n-embed-messages::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  #n8n-embed-messages .msg {
    display: flex; gap: 10px; margin-bottom: 16px;
    align-items: flex-end;
    animation: n8n-fade-in 0.3s ease-out;
  }
  @keyframes n8n-fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  #n8n-embed-messages .msg.user { justify-content: flex-end; }
  #n8n-embed-messages .msg.bot { justify-content: flex-start; }
  #n8n-embed-messages .avatar {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
    color: #374151; font-size: 18px;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  #n8n-embed-messages .msg.user .avatar {
    background: linear-gradient(135deg, ${OPTIONS.primaryColor} 0%, #15803d 100%);
    color: #fff;
  }
  #n8n-embed-messages .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #n8n-embed-messages .bubble {
    max-width: 75%;
    padding: 12px 16px;
    border-radius: 18px;
    line-height: 1.6;
    background: #ffffff;
    color: #1e293b;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    word-wrap: break-word;
    font-weight: 400;
  }
  #n8n-embed-messages .msg.user .bubble {
    background: linear-gradient(135deg, ${OPTIONS.primaryColor} 0%, #15803d 100%);
    color: #fff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
  }
  #n8n-embed-messages .msg.bot .bubble {
    border-bottom-left-radius: 4px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
  }
  #n8n-embed-input {
    display: flex; gap: 8px; padding: 16px;
    border-top: 1px solid #e2e8f0;
    background: #ffffff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.02);
  }
  #n8n-embed-input input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 400;
    outline: none;
    transition: all 0.2s;
    background: #f8fafc;
  }
  #n8n-embed-input input:focus {
    border-color: ${OPTIONS.primaryColor};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
  }
  #n8n-embed-input input:disabled {
    opacity: 0.6; cursor: not-allowed;
    background: #f1f5f9;
  }
  #n8n-embed-input button {
    padding: 12px 16px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
    min-width: 44px;
    font-family: inherit;
  }
  #n8n-embed-input button:disabled {
    opacity: 0.5; cursor: not-allowed;
  }
  #n8n-embed-send {
    background: linear-gradient(135deg, ${OPTIONS.primaryColor} 0%, #15803d 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
  }
  #n8n-embed-send:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
  }
  #n8n-embed-send:active:not(:disabled) {
    transform: translateY(0);
  }
  #n8n-embed-mic {
    background: #f1f5f9;
    color: #475569;
    position: relative;
    overflow: visible;
    border: 2px solid #e2e8f0;
  }
  #n8n-embed-mic:hover:not(:disabled) {
    background: #e2e8f0;
    border-color: #cbd5e1;
  }
  #n8n-embed-mic.listening {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: #fff;
    border-color: #dc2626;
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
  }
  #n8n-embed-mic svg {
    width: 20px;
    height: 20px;
    display: block;
  }
  #n8n-embed-mic.listening svg {
    fill: #fff;
  }
  #n8n-embed-mic.listening::after {
    content: '';
    position: absolute;
    inset: -8px;
    border: 2px solid rgba(220, 38, 38, 0.4);
    border-radius: 16px;
    animation: n8n-pulse 1.2s infinite ease-out;
    pointer-events: none;
  }
  #n8n-typing {
    color: #64748b;
    font-size: 13px;
    margin: 8px 0;
    display: flex;
    gap: 8px;
    align-items: center;
    padding-left: 42px;
    font-style: italic;
  }
  #n8n-typing .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #94a3b8;
    animation: n8n-blink 1.4s infinite ease-in-out;
  }
  #n8n-typing .dot:nth-child(2) { animation-delay: 0.2s; }
  #n8n-typing .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes n8n-blink {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes n8n-pulse {
    0% { opacity: 0.8; transform: scale(0.95); }
    70% { opacity: 0; transform: scale(1.5); }
    100% { opacity: 0; transform: scale(1.5); }
  }
  @media (max-width: 480px) {
    #n8n-embed-box {
      width: calc(100vw - 32px);
      right: 16px;
      bottom: 80px;
      height: calc(100vh - 120px);
      max-height: calc(100vh - 120px);
    }
    #n8n-embed-toggle {
      right: 16px;
      bottom: 16px;
    }
  }
  `;
  document.head.appendChild(style);

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'n8n-embed-toggle';
  toggleBtn.textContent = '🤖';

  const box = document.createElement('div');
  box.id = 'n8n-embed-box';
  box.innerHTML = `
    <div id="n8n-embed-header">
      <img id="n8n-embed-header-logo" src="./logoBSRNew.png" alt="BSR" onerror="this.style.display='none'">
      <span>${OPTIONS.title}</span>
    </div>
    <div id="n8n-embed-messages"></div>
    <div id="n8n-embed-input">
      <input id="n8n-embed-text" type="text" placeholder="Nhập tin nhắn..." />
      <button id="n8n-embed-mic" title="Nhấn để nói"></button>
      <button id="n8n-embed-send">Gửi</button>
    </div>
  `;

  document.body.appendChild(toggleBtn);
  document.body.appendChild(box);


  function createMicIcon(isListening = false) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', isListening ? '#fff' : 'currentColor');
    svg.innerHTML = `
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
      <path d="M19 10v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0v-1h2z"/>
      <path d="M11 19h2v3h-2z"/>
    `;
    return svg;
  }


  function createMicListeningIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', '#fff');
    svg.innerHTML = `
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
      <path d="M19 10v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0v-1h2z"/>
      <path d="M11 19h2v3h-2z"/>
    `;
    return svg;
  }

  const messages = box.querySelector('#n8n-embed-messages');
  const input = box.querySelector('#n8n-embed-text');
  const sendBtn = box.querySelector('#n8n-embed-send');
  const micBtn = box.querySelector('#n8n-embed-mic');

  micBtn.appendChild(createMicIcon());
  
  let typingEl = null;
  let isPending = false;

  let recognizing = false;
  let recognition;

  toggleBtn.onclick = () => {
    const open = box.style.display === 'flex';
    box.style.display = open ? 'none' : 'flex';
    if (!open) input.focus();
  };

  function addMessage(text, who = 'bot', isHtml = false) {
    const msg = document.createElement('div');
    msg.className = 'msg ' + who;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    
    if (who === 'bot') {
      avatar.textContent = '🤖';
    } else {
      const img = document.createElement('img');
      img.src = './logoBSRNew.png';
      img.alt = 'BSR';
      img.onerror = () => {
        // Fallback nếu không load được ảnh
        avatar.textContent = 'You';
        avatar.style.background = `linear-gradient(135deg, ${OPTIONS.primaryColor} 0%, #15803d 100%)`;
        avatar.style.color = '#fff';
        avatar.style.fontSize = '11px';
        avatar.style.fontWeight = '700';
      };
      avatar.appendChild(img);
    }

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    if (isHtml) {
      bubble.innerHTML = text;
    } else {
      bubble.textContent = text;
    }

    if (who === 'bot') {
      msg.appendChild(avatar);
      msg.appendChild(bubble);
    } else {
      msg.appendChild(bubble);
      msg.appendChild(avatar);
    }

    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function setTyping(active) {
    if (active) {
      if (!typingEl) {
        typingEl = document.createElement('div');
        typingEl.id = 'n8n-typing';
        typingEl.innerHTML = '<span>Đang trả lời</span><span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        messages.appendChild(typingEl);
      }
    } else if (typingEl) {
      typingEl.remove();
      typingEl = null;
    }
    messages.scrollTop = messages.scrollHeight;
  }

  // Tạo sessionId mới mỗi lần refresh trang 
  let currentSessionId = null;
  function getSessionId() {
    if (!currentSessionId) {
      currentSessionId = 'sess-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
    }
    return currentSessionId;
  }

  function setDisabled(state) {
    input.disabled = state;
    sendBtn.disabled = state;

    if (state && !recognizing) {
      micBtn.disabled = true;
      micBtn.style.opacity = '0.7';
      micBtn.style.cursor = 'not-allowed';
    } else {
      micBtn.disabled = false;
      micBtn.style.opacity = '';
      micBtn.style.cursor = 'pointer';
    }
    if (state) {
      sendBtn.style.opacity = '0.7';
    } else {
      sendBtn.style.opacity = '';
    }
  }

  async function sendMessage(text) {
    if (isPending) return;
    if (!text.trim()) return;
    isPending = true;
    setDisabled(true);
    addMessage(text, 'user');
    input.value = '';
    setTyping(true);
    try {
      const res = await fetch(OPTIONS.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          chatInput: text,
          action: 'sendMessage'
        })
      });

      const contentType = res.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const payload = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => '');

      if (!res.ok) {
        const detail = isJson ? JSON.stringify(payload) : payload;
        addMessage(`Lỗi ${res.status}: ${res.statusText || 'Webhook lỗi'}${detail ? ' — ' + detail : ''}`, 'bot');
        console.error('Webhook error', res.status, detail);
        setTyping(false);
        return;
      }

      const formatted = (() => {
        if (isJson && payload) {
          if (typeof payload.output === 'string') return payload.output;
          if (typeof payload.reply === 'string') return payload.reply;
          if (typeof payload.message === 'string') return payload.message;
          return JSON.stringify(payload, null, 2);
        }
        if (typeof payload === 'string') return payload;
        return 'Đã nhận.';
      })();

   
      let cleaned = formatted
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        .replace(/\*(.*?)\*/g, '<em>$1</em>') 
        .replace(/\n/g, '<br>') 
        .replace(/\*{2,}/g, '') 
        .replace(/\*([^*\n]+)\*/g, '$1'); 
      
      addMessage(cleaned, 'bot', true);
    } catch (err) {
      console.error('Fetch error:', err);
      
      // Xử lý lỗi CORS 
      if (err.message && err.message.includes('CORS')) {
        const isFileProtocol = window.location.protocol === 'file:';
        let errorMsg = 'Lỗi CORS: Không thể kết nối đến server.';
        if (isFileProtocol) {
          errorMsg += '<br><br><strong>Giải pháp:</strong><br>';
          errorMsg += 'Vui lòng chạy trang web qua local server:<br>';
          errorMsg += '• Python: <code>python -m http.server 8000</code><br>';
          errorMsg += '• Node.js: <code>npx serve .</code><br>';
          errorMsg += '• Sau đó mở: <code>http://localhost:8000</code>';
        } else {
          errorMsg += '<br><br>Server cần cấu hình CORS headers để cho phép truy cập từ origin này.';
        }
        addMessage(errorMsg, 'bot', true);
      } else if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        addMessage('Lỗi kết nối: Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc URL webhook.', 'bot');
      } else {
        addMessage('Lỗi kết nối: ' + (err.message || 'Vui lòng thử lại.'), 'bot');
      }
    }
    isPending = false;
    setDisabled(false);
    setTyping(false);
  }

  sendBtn.onclick = () => sendMessage(input.value);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(input.value);
  });

  // Vietnamese voice input via Web Speech API (best on Chrome/Edge)
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    try {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRec();
      recognition.lang = OPTIONS.lang || navigator.language || 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let permissionGranted = false;
      let permissionChecked = false;

      // Kiểm tra permission 
      async function checkMicrophonePermission() {
        if (permissionChecked) return permissionGranted;
        
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const result = await navigator.permissions.query({ name: 'microphone' });
            permissionGranted = result.state === 'granted';
            permissionChecked = true;
            
            // Lắng nghe thay đổi permission
            result.onchange = () => {
              permissionGranted = result.state === 'granted';
            };
            
            return permissionGranted;
          } catch (err) {
            // Permissions API không hỗ trợ hoặc lỗi
            console.log('Permissions API not available, will request on first use');
          }
        }
        permissionChecked = true;
        return false; 
      }

      recognition.onstart = () => {
        recognizing = true;
        permissionGranted = true; 
        micBtn.innerHTML = '';
        micBtn.appendChild(createMicListeningIcon());
        micBtn.classList.add('listening');
        micBtn.disabled = false;
        micBtn.style.opacity = '';
        micBtn.style.cursor = 'pointer';
      };

      recognition.onend = () => {
        recognizing = false;
        micBtn.innerHTML = '';
        micBtn.appendChild(createMicIcon());
        micBtn.classList.remove('listening');
        
        if (isPending) {
          micBtn.disabled = true;
          micBtn.style.opacity = '0.7';
          micBtn.style.cursor = 'not-allowed';
        }
      };

      recognition.onerror = (event) => {
        recognizing = false;
        micBtn.innerHTML = '';
        micBtn.appendChild(createMicIcon());
        micBtn.classList.remove('listening');
        console.error('Speech recognition error:', event.error);
        
      
        if (event.error === 'not-allowed') {
          permissionGranted = false;
          addMessage('Vui lòng cho phép sử dụng microphone trong cài đặt trình duyệt.', 'bot');
        } else if (event.error === 'no-speech') {
        
        } else if (event.error === 'aborted') {
         
        }
        
        
        if (isPending) {
          micBtn.disabled = true;
          micBtn.style.opacity = '0.7';
          micBtn.style.cursor = 'not-allowed';
        }
      };

      recognition.onresult = (event) => {
        if (event.results.length > 0 && event.results[0].length > 0) {
          const transcript = event.results[0][0].transcript;
          input.value = transcript;
      
          if (transcript.trim()) {
            sendMessage(transcript);
          }
        }
      };

      micBtn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        
        if (isPending && !recognizing) {
          return;
        }
        
    
        if (recognizing) {
          try {
            recognition.stop();
          } catch (err) {
            console.error('Error stopping recognition:', err);
          }
        } else {
          // Kiểm tra permission trước (nếu chưa check)
          await checkMicrophonePermission();
          
         
          try {
            recognition.start();
          } catch (err) {
            console.error('Error starting recognition:', err);
            if (err.name === 'InvalidStateError') {
              // Recognition 
              try {
                recognition.stop();
              } catch (stopErr) {
                // Ignore stop error
              }
              setTimeout(() => {
                try {
                  recognition.start();
                } catch (e) {
                  console.error('Error restarting recognition:', e);
                  if (e.name !== 'InvalidStateError') {
                    addMessage('Không thể khởi động voice input. Vui lòng thử lại.', 'bot');
                  }
                }
              }, 200);
            } else if (err.name === 'NotAllowedError' || err.message?.includes('not allowed')) {
              permissionGranted = false;
              addMessage('Vui lòng cho phép sử dụng microphone.', 'bot');
            }
          }
        }
      };
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      micBtn.disabled = true;
      micBtn.title = 'Không thể khởi tạo voice input';
    }
  } else {
    micBtn.disabled = true;
    micBtn.title = 'Trình duyệt không hỗ trợ voice';
  }
})(); 

