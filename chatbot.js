// AI-Powered Chatbot for Kodkompis Reem using OpenAI API
(function() {
  'use strict';

  // Chatbot configuration
  const CHATBOT_CONFIG = {
    name: 'Reem',
    // API endpoint - will be set via Google Apps Script proxy
    apiEndpoint: window.CHATBOT_API_ENDPOINT || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    // System prompt for the AI
    systemPrompt: `Du är Reems AI-assistent för Kodkompis Reem, en online-undervisningstjänst för programmering och matematik.

VIKTIG INFORMATION OM KODKOMPIS REEM:
- Reem studerar till Civilingenjör i Medieteknik och AI vid Linköpings universitet
- Erbjuder programmeringskurser för alla åldrar
- Erbjuder mattehjälp från grundskola till universitet
- Alla lektioner sker online via Google Meet
- Lektionkostnad varierar efter ålder, innehåll och intriktning
- Bokning sker via Google Calendar: https://calendar.app.google/hcGm2jFduV7YPKEc6
- E-post: kodkompisreem@gmail.com

KURSER:
- 6-8 år: Scratch Jr, visuella block, små berättelser och spel (149 kr/60 min)
- 9-12 år: Scratch & Python, spel och logik (175 kr/60 min)
- 13-16 år: Python & webbutveckling, AI, portföljprojekt (199 kr/60 min)
- Coaching 1:1: Personlig handledning (200 kr/60 min)

MATTEHJÄLP:
- Lågstadiet (åk 1-3): 149 kr/60 min
- Mellan- & högstadiet (åk 4-9): 175 kr/60 min
- Gymnasiematte (Matte 1-4): 199 kr/60 min

DIN ROLL:
- Var vänlig, hjälpsam och professionell
- Använd emojis sparsamt men naturligt
- Svara på svenska, engelska eller arabiska beroende på användarens språk
- Ge konkreta svar med länkar och information när det är relevant
- Om du inte vet något, hänvisa till kontaktformuläret eller e-post
- Var entusiastisk om programmering och lärande men inte överdrivet säljande`,
    
    // Get current language for context
    getCurrentLanguage: () => {
      if (window.i18n) {
        const lang = window.i18n.getLanguage();
        const langMap = { 'sv': 'svenska', 'en': 'english', 'ar': 'arabic' };
        return langMap[lang] || 'svenska';
      }
      return 'svenska';
    },
    
    // Greetings based on language
    getGreeting: () => {
      if (window.i18n) {
        const lang = window.i18n.getLanguage();
        const greetings = {
          'sv': 'Hej! 👋 Jag är Reems AI-assistent. Hur kan jag hjälpa dig idag?',
          'en': 'Hi! 👋 I\'m Reem\'s AI assistant. How can I help you today?',
          'ar': 'مرحباً! 👋 أنا مساعد ريم الذكي. كيف يمكنني مساعدتك اليوم؟'
        };
        return greetings[lang] || greetings['sv'];
      }
      return 'Hej! 👋 Jag är Reems AI-assistent. Hur kan jag hjälpa dig idag?';
    },
    
    placeholder: {
      'sv': 'Skriv ditt meddelande...',
      'en': 'Type your message...',
      'ar': 'اكتب رسالتك...'
    }
  };

  // Message history for context
  let messageHistory = [];

  // Create chatbot HTML
  function createChatbot() {
    const chatbot = document.createElement('div');
    chatbot.id = 'chatbot';
    chatbot.className = 'chatbot';
    
    const currentLang = window.i18n ? window.i18n.getLanguage() : 'sv';
    const placeholder = CHATBOT_CONFIG.placeholder[currentLang] || CHATBOT_CONFIG.placeholder['sv'];
    
    chatbot.innerHTML = `
      <div class="chatbot-toggle" id="chatbotToggle" aria-label="Öppna chat">
        <span class="chatbot-icon">💬</span>
      </div>
      <div class="chatbot-window" id="chatbotWindow">
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <span class="chatbot-avatar">🤖</span>
            <div>
              <strong>${CHATBOT_CONFIG.name}s AI-assistent</strong>
              <span class="chatbot-status">Online</span>
            </div>
          </div>
          <button class="chatbot-close" id="chatbotClose" aria-label="Stäng chat">×</button>
        </div>
        <div class="chatbot-messages" id="chatbotMessages">
          <div class="chatbot-message chatbot-message-bot">
            <span class="chatbot-avatar-small">🤖</span>
            <div class="chatbot-message-content">
              <span class="chatbot-typing-indicator">${CHATBOT_CONFIG.getGreeting()}</span>
            </div>
          </div>
        </div>
        <div class="chatbot-input-wrapper">
          <input 
            type="text" 
            id="chatbotInput" 
            class="chatbot-input" 
            placeholder="${placeholder}"
            aria-label="Skriv ditt meddelande"
          />
          <button class="chatbot-send" id="chatbotSend" aria-label="Skicka meddelande">➤</button>
        </div>
      </div>
    `;
    document.body.appendChild(chatbot);
    return chatbot;
  }

  // Show typing indicator
  function showTypingIndicator() {
    const messages = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message chatbot-message-bot chatbot-typing';
    typingDiv.innerHTML = `
      <span class="chatbot-avatar-small">🤖</span>
      <div class="chatbot-message-content">
        <span class="chatbot-typing-indicator">
          <span></span><span></span><span></span>
        </span>
      </div>
    `;
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
    return typingDiv;
  }

  // Remove typing indicator
  function removeTypingIndicator(typingDiv) {
    if (typingDiv && typingDiv.parentNode) {
      typingDiv.remove();
    }
  }

  // Add message to chat
  function addMessage(text, isBot = false) {
    const messages = document.getElementById('chatbotMessages');
    const typingIndicators = messages.querySelectorAll('.chatbot-typing');
    typingIndicators.forEach(ind => ind.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isBot ? 'chatbot-message-bot' : 'chatbot-message-user'}`;
    
    if (isBot) {
      messageDiv.innerHTML = `
        <span class="chatbot-avatar-small">🤖</span>
        <div class="chatbot-message-content">${escapeHtml(text)}</div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="chatbot-message-content">${escapeHtml(text)}</div>
      `;
    }
    
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Call AI API
  async function callAI(message) {
    const currentLang = CHATBOT_CONFIG.getCurrentLanguage();
    
    // Add user message to history
    messageHistory.push({ role: 'user', content: message });
    
    // Keep history manageable (last 10 messages)
    if (messageHistory.length > 10) {
      messageHistory = messageHistory.slice(-10);
    }
    
    try {
      const response = await fetch(CHATBOT_CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: CHATBOT_CONFIG.systemPrompt + `\n\nAnvändarens språk: ${currentLang}. Svara på samma språk som användaren.` },
            ...messageHistory
          ],
          language: currentLang
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const aiResponse = data.response || data.message || 'Jag kunde inte få ett svar just nu. Försök igen senare.';
      
      // Add AI response to history
      messageHistory.push({ role: 'assistant', content: aiResponse });
      
      return aiResponse;
    } catch (error) {
      console.error('AI API error:', error);
      
      // Fallback responses based on language
      const currentLang = window.i18n ? window.i18n.getLanguage() : 'sv';
      const fallbacks = {
        'sv': 'Ursäkta, jag har tekniska problem just nu. Du kan kontakta Reem direkt på kodkompisreem@gmail.com eller använda kontaktformuläret på sidan.',
        'en': 'Sorry, I\'m having technical issues right now. You can contact Reem directly at kodkompisreem@gmail.com or use the contact form on the page.',
        'ar': 'عذراً، أواجه مشاكل تقنية في الوقت الحالي. يمكنك الاتصال بريم مباشرة على kodkompisreem@gmail.com أو استخدام نموذج الاتصال على الصفحة.'
      };
      
      return fallbacks[currentLang] || fallbacks['sv'];
    }
  }

  // Send message
  async function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, false);
    input.value = '';
    input.disabled = true;
    
    const sendBtn = document.getElementById('chatbotSend');
    sendBtn.disabled = true;

    // Show typing indicator
    const typingDiv = showTypingIndicator();

    try {
      // Call AI
      const response = await callAI(message);
      
      // Remove typing indicator and add response
      removeTypingIndicator(typingDiv);
      addMessage(response, true);
    } catch (error) {
      removeTypingIndicator(typingDiv);
      const currentLang = window.i18n ? window.i18n.getLanguage() : 'sv';
      const errorMsg = {
        'sv': 'Ett fel uppstod. Försök igen senare.',
        'en': 'An error occurred. Please try again later.',
        'ar': 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقاً.'
      };
      addMessage(errorMsg[currentLang] || errorMsg['sv'], true);
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // Update placeholder when language changes
  function updatePlaceholder() {
    const input = document.getElementById('chatbotInput');
    if (!input) return;
    
    const currentLang = window.i18n ? window.i18n.getLanguage() : 'sv';
    input.placeholder = CHATBOT_CONFIG.placeholder[currentLang] || CHATBOT_CONFIG.placeholder['sv'];
  }

  // Initialize chatbot
  function initChatbot() {
    const chatbot = createChatbot();
    const toggle = document.getElementById('chatbotToggle');
    const closeBtn = document.getElementById('chatbotClose');
    const window = document.getElementById('chatbotWindow');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');

    let isOpen = false;

    // Toggle chatbot
    function toggleChatbot() {
      isOpen = !isOpen;
      window.classList.toggle('chatbot-window-open', isOpen);
      toggle.classList.toggle('chatbot-toggle-hidden', isOpen);
      if (isOpen) {
        input.focus();
      }
    }

    // Event listeners
    toggle.addEventListener('click', toggleChatbot);
    closeBtn.addEventListener('click', toggleChatbot);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !input.disabled) {
        sendMessage();
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChatbot();
      }
    });

    // Listen for language changes
    document.addEventListener('languageChanged', () => {
      updatePlaceholder();
      // Update greeting if window is open
      if (isOpen) {
        const firstMessage = document.querySelector('.chatbot-message-bot .chatbot-message-content');
        if (firstMessage) {
          firstMessage.textContent = CHATBOT_CONFIG.getGreeting();
        }
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
