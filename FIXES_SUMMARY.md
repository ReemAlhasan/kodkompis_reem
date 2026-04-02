# Fixes Summary

## Front-end fixes
- Removed all remaining chatbot-related code, stale helper scripts, and unused chatbot styling.
- Fixed contact form topic values so the form always submits stable keys instead of language-dependent labels.
- Added page-specific translated title/description handling so `payments.html` no longer inherits the home page title.
- Improved theme toggle compatibility by supporting both modern and older `matchMedia` listeners.
- Improved mobile navigation so it closes on link click and `Escape`.
- Removed leftover floating CTA spacing that existed only to avoid the old chatbot widget.
- Improved Swish copy-button feedback with a short button label and full status message.
- Updated README to match the current mini-lab based site.

## Google Apps Script fixes
- Removed the old chatbot Apps Script export.
- Hardened the contact form script so it can normalize topic values and accept both parameter-based and JSON-style payloads.
- Improved booking automation by formatting dates consistently, deduplicating guest emails, and escaping HTML in email output.

## Cleanup
- Removed dead extracted script fragments, nested zip files, placeholder files, and repo metadata from the delivered bundle.
