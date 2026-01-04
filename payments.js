document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn');
  const swishEl = document.getElementById('swishNumber');
  const feedback = document.getElementById('copyFeedback');
  const swishQr = document.getElementById('swishQr');
  const downloadQrBtn = document.getElementById('downloadQrBtn');
  if (!copyBtn || !swishEl) return;

  // Ensure button text follows selected language
  function updateTexts() {
    if (window.i18n && typeof window.i18n.t === 'function') {
      copyBtn.textContent = window.i18n.t('payCopyBtn');
      // aria handled by data-i18n-aria via i18n.updateTranslations
    }
  }

  // Set image alt text via i18n
  function updateImageAlt() {
    if (swishQr && window.i18n && typeof window.i18n.t === 'function') {
      swishQr.alt = window.i18n.t('payQrAlt');
    }
    if (downloadQrBtn && window.i18n && typeof window.i18n.t === 'function') {
      downloadQrBtn.textContent = window.i18n.t('payDownloadQr');
    }
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      // fallthrough to fallback
    }

    // Fallback
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (err) {
      return false;
    }
  }

  copyBtn.addEventListener('click', async () => {
    const reference = (document.getElementById('reference')?.value || '').trim();
    const txt = swishEl.textContent.trim() + (reference ? '\nMeddelande: ' + reference : '');
    const ok = await copyText(txt);
    if (ok) {
      const prev = copyBtn.textContent;
      // Use i18n for feedback
      const copiedText = window.i18n ? window.i18n.t('payCopiedFeedback') : 'Swish-numret kopierat till urklipp.';
      const copiedShort = window.i18n ? window.i18n.t('payCopiedFeedback') : 'Kopierat!';
      copyBtn.textContent = copiedShort;
      feedback.textContent = copiedText;
      setTimeout(() => {
        copyBtn.textContent = prev;
        feedback.textContent = '';
      }, 2500);
    } else {
      feedback.textContent = window.i18n ? window.i18n.t('payCopyFail') : 'Kunde inte kopiera automatiskt. Markera och kopiera manuellt.';
    }
  });

  // Initialize texts and update when language changes
  updateTexts();
  updateImageAlt();
  document.addEventListener('languageChanged', updateTexts);
  document.addEventListener('languageChanged', updateImageAlt);

  // Ensure download link points to the supplied local image by default
  if (swishQr && downloadQrBtn) {
    // Display small image but link download to the large version
    downloadQrBtn.href = 'assets/swish-QR-large.png';
  }
});
