
    // Hamburger toggle
    (function(){
      const toggle = document.getElementById('navToggle');
      const nav = document.getElementById('primary-nav');
      if (!toggle || !nav) return;
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('no-scroll', open);
      });
    })();
  