
    // Theme management
    (function() {
      const themeToggle = document.getElementById('themeToggle');
      const themeIcon = themeToggle?.querySelector('.theme-icon');
      const STORAGE_KEY = 'kodkompis-theme';
      
      // Get system preference
      function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      // Get saved theme or system preference
      function getTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved || getSystemTheme();
      }
      
      // Set theme
      function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        updateThemeIcon(theme);
      }
      
      // Update toggle button icon
      function updateThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        // Use i18n for aria-label translation
        const labelKey = theme === 'dark' ? 'themeToggleLight' : 'themeToggle';
        const label = window.i18n ? window.i18n.t(labelKey) : (theme === 'dark' ? 'Byt till ljust läge' : 'Byt till mörkt läge');
        themeToggle.setAttribute('aria-label', label);
      }
      
      // Toggle theme
      function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
      }
      
      // Initialize theme
      function initTheme() {
        const theme = getTheme();
        setTheme(theme);
        
        // Listen for system theme changes (if no manual preference)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem(STORAGE_KEY)) {
            setTheme(e.matches ? 'dark' : 'light');
          }
        });
        
        // Listen for language changes to update theme toggle aria-label
        document.addEventListener('languageChanged', () => {
          const currentTheme = document.documentElement.getAttribute('data-theme');
          if (currentTheme) {
            updateThemeIcon(currentTheme);
          }
        });
        
        // Add click event to toggle button
        if (themeToggle) {
          themeToggle.addEventListener('click', toggleTheme);
        }
      }
      
      // Initialize when DOM is loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
      } else {
        initTheme();
      }
    })();
  