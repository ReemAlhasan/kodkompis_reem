# Kodkompis Reem

Kodkompis Reem is a playful, safe website for teaching programming and mathematics to children and young people. The site offers online courses, coaching, an embedded Google Calendar booking flow, payment instructions, and interactive puzzles.

## Features

- **Responsive Design:** Works on desktop, tablet, and mobile.
- **Interactive Coding & Math Puzzles:**  
  - Age-adapted daily puzzles with hints and answer checking  
  - No account required
- **Course & Coaching Information:**  
  - Programming courses for ages 6–16  
  - Math help from elementary to university level
- **Contact Form:**  
  - Spam-protected form posting to a Google Apps Script endpoint
- **Payments:**  
  - Dedicated Swish payment page with QR code, copy-to-clipboard, and an optional payment reference
- **Accessibility:**  
  - Semantic HTML, ARIA labels, keyboard navigation
- **Mobile Navigation:**  
  - Hamburger menu for small screens

## Usage

1. **Clone or Download:**  
   Download or clone this repository.

2. **Open in Browser:**  
   Open `index.html` in your web browser.  
   No build step or server is required.

3. **Daily Puzzle:**  
   - Go to the "Dagens kodpussel" section.
   - Select age group and click "Visa dagens pussel".
   - Enter your answer, check it, get hints, or reveal the solution.

4. **Contact:**  
   - Fill in the contact form to get in touch or book a course.

5. **Booking:**  
   - Scroll to the booking section and use the embedded Google Calendar scheduler directly on the page.

## File Overview

- [`index.html`](index.html): Main website structure and content
- [`style.css`](style.css): All styles and responsive layout
- [`pussel.js`](pussel.js): Logic for daily puzzles (fetching, answer checking, hints)
- [`payments.html`](payments.html): Swish payment page
- [`payments.js`](payments.js): Swish page interactions
- [`translations.js`](translations.js): Translation strings for Swedish, English, and Arabic
- [`i18n.js`](i18n.js): Client-side language switching
- [`apps-script/`](apps-script): Local source copies for the related Google Apps Script projects
- [`LICENSE`](LICENSE): MIT License

## Customization

- **Puzzles:**  
  - By default, puzzles are fetched from a Google Apps Script endpoint.
  - If the endpoint is unavailable, local puzzles are used (see `pussel.js`).

- **Booking:**  
  - The page embeds a Google Calendar appointment schedule in an iframe.
  - Update the booking URL in `index.html` if your schedule link changes.

- **Contact Form:**  
  - Uses a Google Apps Script endpoint for submissions.  
  - Update the `action` attribute in the form if you want to use your own endpoint.

## License

MIT License – see [`LICENSE`](LICENSE) for details.

---

*Built with ♥ for curiosity and learning.*
