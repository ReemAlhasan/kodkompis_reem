
    // Floating CTA - show after scrolling
    (function() {
      const floatingCTA = document.querySelector('.floating-cta');
      if (!floatingCTA) return;
      
      let lastScrollY = window.scrollY;
      let ticking = false;
      
      function updateCTA() {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 400;
        
        // Show CTA after scrolling past hero section
        if (scrollY > heroHeight * 0.5) {
          floatingCTA.classList.add('visible');
        } else {
          floatingCTA.classList.remove('visible');
        }
        
        lastScrollY = scrollY;
        ticking = false;
      }
      
      function requestTick() {
        if (!ticking) {
          requestAnimationFrame(updateCTA);
          ticking = true;
        }
      }
      
      window.addEventListener('scroll', requestTick, { passive: true });
      // Check on load
      updateCTA();
    })();
  