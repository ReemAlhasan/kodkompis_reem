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

  // Open Swish: copy number+reference and attempt to open Swish app; fallback to opening the QR image
  const openSwishBtn = document.getElementById('openSwishBtn');
  if (openSwishBtn) {
    openSwishBtn.addEventListener('click', async () => {
      const reference = (document.getElementById('reference')?.value || '').trim();
      const txt = swishEl.textContent.trim() + (reference ? '\nMeddelande: ' + reference : '');
      const ok = await copyText(txt);

      if (ok) {
        feedback.textContent = window.i18n ? window.i18n.t('payCopiedFeedback') : 'Swish-numret kopierat till urklipp.';
      } else {
        feedback.textContent = window.i18n ? window.i18n.t('payCopyFail') : 'Kunde inte kopiera automatiskt. Markera och kopiera manuellt.';
      }

      // Try to open the Swish app with number+message using several deep-link attempts.
      // Keep the clipboard copy as primary fallback; deep links may not be supported on all platforms.
      const number = swishEl.textContent.trim();
      const msg = reference || '';

      // Candidates to try (in order):
      const candidates = [];

      // 1) Android intent URI (may work on many Android devices)
      try {
        const intentUri = `intent://payment?phone=${encodeURIComponent(number)}&message=${encodeURIComponent(msg)}#Intent;package=se.bankgirot.swish;scheme=swish;end`;
        candidates.push(intentUri);
      } catch (e) {}

      // 2) swish:// scheme with query params (some implementations may support this)
      try {
        const swishUri = `swish://payment?phone=${encodeURIComponent(number)}&message=${encodeURIComponent(msg)}`;
        candidates.push(swishUri);
      } catch (e) {}

      // 3) Fallback: open the large QR image in a new tab so user can scan or use share
      const qrFallback = downloadQrBtn.href || 'assets/swish-QR-large.png';
      candidates.push(qrFallback);

      // Try candidates sequentially; if one navigates away the script stops. Use a small delay before opening fallback.
      (function tryOpen(list, idx) {
        if (idx >= list.length) return;
        const target = list[idx];
        if (target.startsWith('http')) {
          // open fallback in new tab
          window.open(target, '_blank');
          return;
        }
        // For URI schemes and intent URIs, attempt to navigate
        let opened = false;
        try {
          window.location.href = target;
          opened = true;
        } catch (e) {
          opened = false;
        }

        // If navigation didn't occur, try next after short delay
        setTimeout(() => {
          // If the app handled the intent the page may be hidden or unloaded; otherwise try next
          tryOpen(list, idx + 1);
        }, 800);
      })(candidates, 0);
    });
  }

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
