
    (function() {
      if (!window.BOOKING_EMBED_URL) return;

      const bookingFrame = document.getElementById('bookingFrame');
      if (bookingFrame) {
        bookingFrame.src = window.BOOKING_EMBED_URL;
      }

      document.querySelectorAll('[data-booking-external-link]').forEach((link) => {
        link.href = window.BOOKING_EMBED_URL;
      });
    })();
  