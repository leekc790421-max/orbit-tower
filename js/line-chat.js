// LINE Chat Widget JavaScript

class LineChatWidget {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.init();
  }

  init() {
    this.createWidget();
    this.bindEvents();
    this.showWelcomeMessage();
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.className = 'line-chat-widget';
    widget.id = 'line-chat-widget';
    
    widget.innerHTML = `
      <div class="line-chat-header">
        <div class="line-chat-avatar">
          <svg viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.514.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.465.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.592.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.181 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.383 24 12.458 24 10.314"/></svg>
        </div>
        <div class="line-chat-info">
          <div class="line-chat-title">光曜星樞 SNT</div>
          <div class="line-chat-status">線上服務中</div>
        </div>
        <button class="line-chat-close" onclick="lineChat.toggle()">&times;</button>
      </div>
      
      <div class="line-chat-messages" id="line-chat-messages"></div>
      
      <div class="line-chat-quick-replies" id="line-chat-quick-replies">
        <div class="line-chat-quick-reply" onclick="lineChat.sendQuickReply('價格方案')">💰 價格方案</div>
        <div class="line-chat-quick-reply" onclick="lineChat.sendQuickReply('預約諮詢')">📅 預約諮詢</div>
        <div class="line-chat-quick-reply" onclick="lineChat.sendQuickReply('科技藝廊')">🖼️ 科技藝廊</div>
        <div class="line-chat-quick-reply" onclick="lineChat.sendQuickReply('AI 能力')">🤖 AI 能力</div>
      </div>
      
      <div class="line-chat-input-area">
        <div class="line-chat-input-wrapper">
          <input 
            type="text" 
            class="line-chat-input" 
            id="line-chat-input" 
            placeholder="輸入您的訊息..."
            onkeypress="if(event.key==='Enter') lineChat.sendMessage()"
          >
          <button class="line-chat-send" id="line-chat-send" onclick="lineChat.sendMessage()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(widget);
    this.widget = widget;
    this.messagesContainer = document.getElementById('line-chat-messages');
    this.input = document.getElementById('line-chat-input');
    this.sendButton = document.getElementById('line-chat-send');
    this.quickReplies = document.getElementById('line-chat-quick-replies');
  }

  bindEvents() {
    // Update floating button to toggle chat
    const floatBtn = document.querySelector('.line-float-btn');
    if (floatBtn) {
      floatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.widget.classList.toggle('active', this.isOpen);
    
    if (this.isOpen) {
      this.input.focus();
      this.scrollToBottom();
    }
  }

  showWelcomeMessage() {
    setTimeout(() => {
      this.addMessage('bot', '您好！歡迎來到 Orbit Tower AI Digital Headquarters。我是您的 AI 助手，有什麼可以幫您的嗎？');
    }, 500);
  }

  addMessage(type, text) {
    const messageEl = document.createElement('div');
    messageEl.className = `line-chat-message ${type}`;
    
    const avatar = type === 'bot' ? '🤖' : '👤';
    
    messageEl.innerHTML = `
      <div class="line-chat-message-avatar">${avatar}</div>
      <div class="line-chat-message-bubble">${this.escapeHtml(text)}</div>
    `;
    
    this.messagesContainer.appendChild(messageEl);
    this.messages.push({ type, text });
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'line-chat-message bot';
    typingEl.id = 'typing-indicator';
    typingEl.innerHTML = `
      <div class="line-chat-message-avatar">🤖</div>
      <div class="line-chat-typing">
        <div class="line-chat-typing-dot"></div>
        <div class="line-chat-typing-dot"></div>
        <div class="line-chat-typing-dot"></div>
      </div>
    `;
    this.messagesContainer.appendChild(typingEl);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
      typingEl.remove();
    }
  }

  async sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;

    // Add user message
    this.addMessage('user', message);
    this.input.value = '';
    this.sendButton.disabled = true;

    // Hide quick replies after first message
    if (this.quickReplies) {
      this.quickReplies.style.display = 'none';
    }

    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Send to API
      const response = await fetch('/api/line', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      
      this.hideTypingIndicator();

      if (data.success && data.reply) {
        // Simulate typing delay
        setTimeout(() => {
          this.addMessage('bot', data.reply);
          this.sendButton.disabled = false;
        }, 800);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      this.hideTypingIndicator();
      
      // Fallback response
      setTimeout(() => {
        this.addMessage('bot', '感謝您的訊息！我們的顧問會盡快回覆您。如需即時協助，請加入 LINE 官方帳號 @559julyu。');
        this.sendButton.disabled = false;
      }, 800);
    }
  }

  sendQuickReply(text) {
    this.input.value = text;
    this.sendMessage();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize chat widget
let lineChat;
document.addEventListener('DOMContentLoaded', () => {
  lineChat = new LineChatWidget();
});
