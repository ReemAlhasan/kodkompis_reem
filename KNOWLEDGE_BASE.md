# KodKompis Reem - AI Agent Knowledge Base

## 1. Entity Profile

**Identity:** Kodkompis Reem is an individual educator/entrepreneur brand, not a company. Reem is the sole instructor.

**Background:** Reem studies Civil Engineering in Media Technology and AI at Linköping University.

**Mission:** Foster creativity, logical thinking, and confidence with technology through playful, personalized online education.

**Core Belief:** "Alla kan lära sig programmera" (Everyone can learn programming).

**Teaching Philosophy:** Uses "lekfulla övningar, små projekt och tydliga förklaringar" (playful exercises, small projects, and clear explanations).

**Personal Brand:** Described as "nyfiken och lugn coach" (curious and calm coach).

**Website:** kodkompis-reem.se (referenced in script.json)

**Email:** kodkompisreem@gmail.com (used for all form submissions)

**Logo:** https://i.ibb.co/9k0rj5jY/f49efbf7-5551-466b-bc1f-3f032c297633.png

**Timezone:** Europe/Stockholm (Sweden)

## 2. Target Audience & Offerings

### Age-Specific Programming Courses:

- **6–8 år:** Scratch Jr, visual blocks, small stories and games (prova-på: 30 min)
- **9–12 år:** Scratch & first steps in Python, game building, logic training (prova-på: 30 min)
- **13–16+ år:** Python & web development, problem-solving, simple AI, portfolio projects (prova-på: 30 min)
- **Adults 17+:** Personal tutoring for homework, competition prep, personal projects (prova-på: 30 min)

### Mathematics Help:

- **6–8 år:** Counting understanding, mathematical language, playful learning
- **9–12 år:** Understanding basics, building confidence, logical thinking
- **13–16 år:** Course support and national exams
- **17+ (University):** Analysis / university courses

### Delivery Method:

- All lessons online via Google Meet
- No physical meetings – flexible and safe
- Free 30-minute trial lessons available
- Personalized 1:1 coaching

## 3. Communication Style & Tone

### Language:

- **Primary:** Swedish (all main UI content, puzzles, course descriptions)
- **Secondary:** English (only for Google Forms - student agreements)
- **Code Comments:** Mix of Swedish and English

### Tone:

- **Playful & Encouraging:** Uses emojis (💫, 🎯, 🧩), positive reinforcement ("Grymt jobbat", "Rätt!"), celebrates achievements
- **Supportive:** "Fråga din handledare!" (Ask your coach!), "Vänligen vänta" (Please wait)
- **Clear & Simple:** Short sentences, direct instructions, avoids jargon where possible
- **Inclusive:** "alla kan lära sig programmera", "tryggt" (safe), accessible language

### UI Text Patterns:

- Age groups displayed as "6–8 år" with Swedish "å" character
- Buttons use imperative verbs: "Visa dagens pussel", "Kontrollera", "Boka"
- Feedback messages in Swedish: "Ansluter till servern...", "Laddar pusseldata..."

## 4. Technical Architecture

### Frontend Stack:

- **HTML5:** Semantic structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- **CSS3:** Custom properties, Flexbox, Grid, animations
- **JavaScript:** Vanilla ES6+, no frameworks or external dependencies
- **Fonts:** Inter (body), Fredoka (headings/logo)

### Backend Stack:

- **Google Apps Script:**
  - Puzzle data server (JSONP endpoint)
  - Contact form handler (MailApp)
  - Automated Google Forms generator for student agreements
- **Data Storage:** Google Sheets (auto-linked to Forms)
- **Email:** MailApp.sendEmail to kodkompisreem@gmail.com

### APIs & Protocols:

- **JSONP:** For puzzle fetching (avoids CORS issues, supports callback parameter)
- **FormData:** Plain POST requests for contact form
- **Web Crypto API:** SHA-256 hashing for answer verification

### Data Formats:

- **Puzzle Response:** `{dateKey: "YYYY-MM-DD", data: {"6-8": [{title, text, answer_hash, hint}]}}`
- **Form Responses:** Stored in Google Sheets with labeled columns

## 5. Design & UX Requirements

### Theming:

- **Light Mode:** Default, off-white background (#fffdf8)
- **Dark Mode:** Auto-detects `prefers-color-scheme: dark`, manual toggle available
- **Theme Persistence:** Stored in localStorage as `data-theme` attribute

### Color Palette:

- `--brand`: Purple (#6a5cff light, #8b80ff dark) - primary actions
- `--brand-2`: Teal (#00c2a8 light, #00d6b3 dark) - success/feedback
- `--accent`: Gold (#ffb703 light, #ffca28 dark) - warnings/highlights
- `--bg`: Off-white (#fffdf8) / Near-black (#0f0f0f)
- `--text`: Dark gray (#1d1c1c) / Light gray (#f5f5f5)
- `--card`: White (#ffffff) / Dark gray (#1a1a1a)

### Layout:

- **Mobile-first:** Responsive breakpoints at 760px, 900px
- **Sticky Header:** Navigation with backdrop blur effect
- **Grid Layouts:** Hero section (1.2fr / 0.8fr), cards (auto-fit minmax)
- **Hamburger Menu:** On mobile (≤760px), toggles `.open` class

### Accessibility:

- **Semantic HTML:** Proper sectioning, ARIA labels on forms
- **Keyboard Navigation:** Tab, Enter, Escape support
- **Focus Indicators:** Visible `outline: 2px solid brand` on all interactive elements
- **Reduced Motion:** Respects `prefers-reduced-motion: reduce`
- **Color Contrast:** WCAG AA compliant (4.5:1 minimum)
- **Screen Reader:** Proper heading hierarchy, descriptive text

### Interactive Elements:

- **Buttons:** `.btn` class, primary/ghost variants, loading spinner on `.loading`
- **Forms:** `.field` wrapper, required validation, email/phone validators
- **Puzzle UI:** Age selector, text input, hint/reveal buttons, feedback area
- **Theme Toggle:** Animated sun/moon icon, rotates on dark mode

### Loading States:

- Multi-stage progress messages: "Ansluter...", "Laddar...", "Bearbetar..."
- Spinner animations (CSS only)
- Offline fallback indicator: "Använder offline-pussel."

## 6. Constraints & Limitations

### Technical Constraints:

- **No Build Process:** Files must be usable directly (no npm, webpack)
- **No Server-Side Rendering:** Static HTML only
- **No Database:** Google Sheets is the only data store
- **No User Accounts:** Anonymous puzzle solving, no authentication
- **No External Dependencies:** Must work offline after first load
- **Browser Support:** Modern browsers with Web Crypto API (Chrome/Edge 90+, Firefox 88+, Safari 14+)
- **Answer Security:** SHA-256 hashing requires Web Crypto; falls back to plain-text if unavailable

### Data Privacy:

- **GDPR Compliance:** Privacy notices in Swedish/English, consent checkboxes, 12-month data retention policy
- **No Third-Party Trackers:** No Google Analytics, Facebook Pixel, etc.
- **Form Data:** Sent to kodkompisreem@gmail.com via Google Apps Script
- **Age Parameter:** Sent as URL parameter to puzzle endpoint (no PII)

### Content Limitations:

- **Single Daily Puzzle:** Deterministic seeding means same puzzle for all users in age group
- **Static Content:** Course descriptions hardcoded in HTML
- **Swedish UI Only:** Main site not localized (only forms support English)

### Performance:

- **Bundle Size:** ~42 KB total (HTML + CSS + JS)
- **Puzzle Fetch Timeout:** 6 seconds before offline fallback activates
- **CDN Limitations:** Logo hosted on i.ibb.co (ImgBB) - external dependency

## 7. Contact & Operational Details

### Contact Form Fields:

- Name (text)
- Email (email, validated)
- Phone (text)
- Child's age (text)
- Message (paragraph)
- Consent checkboxes (required):
  - "Jag godkänner att ni får kontakta mig" (I consent to being contacted)
  - GDPR/privacy consent

### Student Agreement Forms (Auto-Generated):

Four variants created by script.json:

- `PARENTS_DEF_SV`: Swedish, guardians of minors
- `ADULT_DEF_SV`: Swedish, adult students (18+)
- `PARENTS_DEF_EN`: English, guardians of minors
- `ADULT_DEF_EN`: English, adult students

### Form Sections:

- Logo at top
- Terms/Privacy section (static text)
- Student/guardian details (name, age, email, phone)
- Lesson type (Mathematics/Programming/Analysis/Other)
- Special needs (optional)
- Consent checkboxes (participation, contact, photo usage)
- City and date
- Digital signature

### Privacy Text (Swedish):

"Integritet & lagring: Kodkompis Reem behandlar dina uppgifter för att administrera undervisning och kontakt. Rättslig grund är avtal (myndiga elever) respektive samtycke (vårdnadshavare för minderåriga). Uppgifterna sparas som längst i 12 månader efter avslutad undervisning och raderas/avidentifieras därefter. Vi delar inte uppgifterna med tredje part utöver våra personuppgiftsbiträden för IT‑tjänster (t.ex. Google). Du har rätt till tillgång, rättelse och radering enligt GDPR. Kontakt: kodkompisreem@gmail.com."

### Response Handling:

- **Contact Form:** Emails sent directly to kodkompisreem@gmail.com
- **Student Agreements:** Responses auto-linked to Google Sheets (one per form)
- **Response Time:** "Jag återkommer inom 24 timmar" (I will respond within 24 hours)

### Deployment:

- **Web Hosting:** Any static host (GitHub Pages, Vercel, Netlify, traditional web host)
- **Google Apps Script:** Must be deployed as web app for puzzle endpoint and contact form
- **No Server Required:** All files can be opened directly in browser for development

## 8. Puzzle System Details

### Age Groups & Sample Content:

**6-8 år (Introductory):**
- Robot path tracing (coordinates)
- Fruit emoji codes (simple arithmetic)
- Number patterns

**9-12 år (Intermediate):**
- Scratch loop logic
- Binary to decimal conversion
- Conditional logic (if/else)

**13-16 år (Advanced):**
- Python string slicing
- Algorithm complexity (Big O)
- Probability calculations

### Answer Verification:

- **Secure Mode:** SHA-256 hash comparison (server stores hash, client hashes user input)
- **Fallback Mode:** Plain-text comparison (for offline puzzles or older browsers)
- **Normalization:** `trim().toLowerCase().replace(/\s+/g, '')` before comparison

### Offline Fallback:

- 9 built-in puzzles (3 per age group)
- Activates automatically if JSONP fails or times out
- Shows "Använder offline-pussel." message

## 9. Brand Assets & Identity

**Logo:** Kodkompis Reem wordmark with icon (purple/teal gradient implied by color scheme)

**Tagline:** Implicitly "alla kan lära sig programmera"

### Visual Identity:

- Playful but professional
- Child-friendly but not childish
- Modern, clean interface
- Emphasis on safety ("tryggt")

### Values:

- Curiosity
- Inclusivity
- Safety (GDPR, online-only)
- Personal connection (1:1 coaching)
- Progressive learning (play → projects → portfolio)

## 10. Legal & Compliance

### GDPR:

- Privacy notices in all forms
- Separate consent for contact, participation, photo usage
- 12-month data retention limit
- Right to access, rectification, erasure
- IT processors disclosed (Google)

### Student Agreements:

- Digital signatures (type name)
- City/date fields for validity
- Separate forms for minors (parental consent) and adults

### Accessibility:

- WCAG AA target (color contrast, keyboard nav, semantic HTML)
- No legal accessibility statement in current files

---

*This knowledge base is maintained for AI agents and developers working on the Kodkompis Reem project. Last updated: 2024*

