
    (function () {
      const form = document.getElementById('contactForm');
      const note = document.getElementById('formNote');
      const submitBtn = form?.querySelector('button[type="submit"]');
      if (!form) return;

      function setSubmitting(submitting) {
        if (submitBtn) {
          submitBtn.disabled = submitting;
        }
      }

      async function submitAsJson() {
        const formData = new FormData(form);
        const body = new URLSearchParams();

        formData.forEach((value, key) => {
          body.append(key, value);
        });

        const response = await fetch(form.action, {
          method: 'POST',
          body
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      }

      async function submitNoCorsFallback() {
        await fetch(form.action, {
          method: 'POST',
          mode: 'no-cors',
          body: new FormData(form)
        });
      }
  
      form.addEventListener('submit', async (e) => {
        // Allow pure HTML fallback if fetch is missing
        if (!window.fetch) return;
        e.preventDefault();
  
        if (!form.checkValidity()) {
          note.textContent = window.i18n ? window.i18n.t('formInvalid') : 'Kolla så att alla fält är ifyllda korrekt.';
          form.reportValidity();
          return;
        }
  
        // Honeypot (bot-skydd)
        const hp = form.querySelector('input[name="hp"]')?.value || '';
        if (hp.trim() !== '') {
          note.textContent = window.i18n ? window.i18n.t('formQueued') : 'Tack! Din förfrågan har skickats vidare.';
          form.reset();
          return;
        }
  
        note.textContent = window.i18n ? window.i18n.t('formSending') : 'Skickar…';
        setSubmitting(true);
  
        try {
          if (window.CONTACT_FORM_JSON_MODE) {
            try {
              const result = await submitAsJson();
              if (result && result.ok) {
                note.textContent = window.i18n ? window.i18n.t('formSuccess') : 'Tack! Ditt meddelande är skickat. Jag återkommer inom 24 timmar.';
                form.reset();
              } else if (result && result.error === 'validation_failed') {
                note.textContent = window.i18n ? window.i18n.t('formInvalid') : 'Kolla så att alla fält är ifyllda korrekt.';
                form.reportValidity();
              } else {
                note.textContent = window.i18n ? window.i18n.t('formError') : 'Nätverksfel. Kontrollera din uppkoppling eller mejla kodkompisreem@gmail.com';
              }
              return;
            } catch (jsonErr) {
              console.warn('JSON contact submission failed, using no-cors fallback:', jsonErr);
            }
          }

          await submitNoCorsFallback();
          note.textContent = window.i18n ? window.i18n.t('formQueued') : 'Din förfrågan har skickats vidare. Om du inte får svar inom 24 timmar, mejla kodkompisreem@gmail.com.';
          form.reset();
        } catch (err) {
          console.error('Kontaktform undantag:', err);
          note.textContent = window.i18n ? window.i18n.t('formError') : 'Nätverksfel. Kontrollera din uppkoppling eller mejla kodkompisreem@gmail.com';
        } finally {
          setSubmitting(false);
        }
      });
    })();
  
    document.getElementById('year').textContent = new Date().getFullYear();
  