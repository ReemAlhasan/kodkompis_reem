// Internationalization (i18n) system for Kodkompis Reem
(function() {
  'use strict';

  const STORAGE_KEY = 'kodkompis-language';
  const DEFAULT_LANG = 'sv';
  const RTL_LANGS = ['ar'];

  let currentLang = DEFAULT_LANG;

  // Get saved language or default
  function getSavedLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) {
      return saved;
    }
    // Try to detect from browser
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('ar')) return 'ar';
    if (browserLang.startsWith('en')) return 'en';
    return DEFAULT_LANG;
  }

  // Set language
  function setLanguage(lang) {
    if (!translations[lang]) {
      console.warn(`Language ${lang} not found, using default`);
      lang = DEFAULT_LANG;
    }
    
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    
    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', lang);
    
    // Update dir attribute for RTL
    if (RTL_LANGS.includes(lang)) {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl');
    }
    
    // Update page title and meta description
    if (translations[lang].title) {
      document.title = translations[lang].title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && translations[lang].description) {
      metaDesc.setAttribute('content', translations[lang].description);
    }
    
    // Update all translatable elements
    updateTranslations();
    
    // Update language switcher
    updateLanguageSwitcher();
    
    // Trigger custom event
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  // Get translation
  function t(key, params = {}) {
    const translation = translations[currentLang]?.[key] || translations[DEFAULT_LANG]?.[key] || key;
    
    // Replace placeholders
    return translation.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }

  // Update all translatable elements
  function updateTranslations() {
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = t(key);
      
      // Handle different element types
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.type === 'submit' || element.type === 'button') {
          element.value = translation;
        } else {
          element.placeholder = translation;
        }
      } else if (element.tagName === 'OPTION') {
        element.textContent = translation;
      } else {
        // Check if it's HTML content
        if (translation.includes('<')) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
    
    // Update aria-labels
    const ariaElements = document.querySelectorAll('[data-i18n-aria]');
    ariaElements.forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      element.setAttribute('aria-label', t(key));
    });
    
    // Update form validation messages (if any)
    updateFormMessages();
    
    // Update footer year
    const footerText = document.querySelector('[data-i18n="footerText"]');
    if (footerText) {
      const year = new Date().getFullYear();
      footerText.textContent = t('footerText', { year });
    }
  }

  // Update form validation and messages
  function updateFormMessages() {
    // This will be called when form is submitted
    // The actual form handling code will use t() function
  }

  // Update language switcher UI
  function updateLanguageSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;
    
    const buttons = switcher.querySelectorAll('button');
    buttons.forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === currentLang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Initialize
  function init() {
    // Set initial language
    setLanguage(getSavedLanguage());
    
    // Add event listeners to language switcher buttons
    const switcher = document.getElementById('langSwitcher');
    if (switcher) {
      const buttons = switcher.querySelectorAll('button[data-lang]');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const lang = btn.getAttribute('data-lang');
          setLanguage(lang);
        });
      });
    }
  }

  // Export functions
  window.i18n = {
    setLanguage,
    getLanguage: () => currentLang,
    t,
    init
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

