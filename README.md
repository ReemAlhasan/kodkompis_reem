# Kodkompis Reem

Kodkompis Reem is a playful, safe website for teaching programming and mathematics to children and young people (ages 6–16). The site offers online courses, coaching, and interactive puzzles, all designed to foster creativity, logical thinking, and confidence with technology.

## Features

- **Responsive Design:** Works on desktop, tablet, and mobile.
- **Interactive Coding & Math Puzzles:**  
  - Age-adapted daily puzzles with hints and answer checking  
  - No account required
- **Course & Coaching Information:**  
  - Programming courses for ages 6–16  
  - Math help from elementary to university level
- **Contact Form:**  
  - AJAX-powered, spam-protected form (Formspree integration)
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

## File Overview

- [`index.html`](index.html): Main website structure and content
- [`style.css`](style.css): All styles and responsive layout
- [`pussel.js`](pussel.js): Logic for daily puzzles (fetching, answer checking, hints)
- [`LICENSE`](LICENSE): MIT License

## Customization

- **Puzzles:**  
  - By default, puzzles are fetched from a Google Apps Script endpoint.
  - If the endpoint is unavailable, local puzzles are used (see `pussel.js`).

- **Contact Form:**  
  - Uses Formspree for submissions.  
  - Update the `action` attribute in the form if you want to use your own endpoint.

## License

MIT License – see [`LICENSE`](LICENSE) for details.

---

*Built with ♥ for curiosity and learning.*