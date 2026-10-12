# ANYA — skincare studio website (prototype)

A multi-page HTML/CSS/JavaScript prototype for **ANYA**, a fictional skincare and facial studio.
There's no framework, build step, backend or paid dependency. Every business detail is a placeholder.

## Run it locally

From this folder:

```
py serve.py
```

Then open http://localhost:5640. `serve.py` is Python's built-in web server with caching turned off, so a normal refresh always loads your latest edits.
Use a server rather than double-clicking the HTML files, because the intro video and some browser features behave differently on `file://`.

## Project structure

```
index.html          Home: opening intro, hero, about, featured treatments, philosophy, testimonials, CTA
treatments.html     All four treatments, WhatsApp enquiry, FAQ
booking.html        5-step demo booking form + confirmation panel
philosophy.html     Brand philosophy (three themes)
contact.html        Contact form (demo), placeholder details, map placeholder
css/main.css        Design tokens, reset, header/nav, buttons, cards, forms, footer
css/intro.css       Opening video intro (homepage only)
css/booking.css     Booking page
js/config.js        ONE place for: WhatsApp number, contact details, hours, treatments, video path
js/layout.js        Builds the shared header, footer and floating WhatsApp button
js/services.js      Renders treatment cards from config.js
js/intro.js         Plays the intro once per tab, plus fallbacks
js/booking.js       Booking steps, validation, review, confirmation
js/contact.js       Contact form validation + demo success
assets/video/       anya-intro.mp4 (the Higgsfield droplet video)
assets/images/      intro poster (first frame), intro fallback (last frame), droplet photo, favicon
```

## Common edits

- **WhatsApp number:** in `js/config.js`, replace `whatsapp.number` (`"60XXXXXXXXX"`) with the real number, digits only. Until then, every WhatsApp button shows a "demo" message instead of opening a chat.
- **Prices, durations, descriptions, photos:** edit `services` in `js/config.js`. The homepage, treatments page and booking form all update together.
- **Intro video:** edit `intro.videoSrc` in `js/config.js`.
- **Colours and fonts:** edit the variables at the top of `css/main.css`.

## What works and what's simulated

| Works for real | Simulated (demo only) |
|---|---|
| Page navigation, active page, mobile menu | Booking confirmation: nothing is reserved or sent |
| Treatment card → booking with that service preselected | Time-slot availability (made-up sample data) |
| Date limits (no past dates, 60 days ahead, closed Mondays) | Opening hours, address, phone, email |
| Form validation, review + edit, confirmation panel | Contact form "success" (no message is sent) |
| Intro: plays once per tab, skip, reduced-motion/error/autoplay fallbacks | Testimonials (fictional, labelled as such) |
| WhatsApp link building (once a real number is set) | Social links (placeholders) |

Booking and contact details are kept **only in memory** (a JavaScript object). They are never written to localStorage or sent anywhere, and they disappear on refresh. The only thing stored is a `sessionStorage` flag recording that the intro has played.

## Making bookings real

You would need:
1. A backend or booking service (for example a small API with a database, or a hosted scheduler such as Calendly or SimplyBook) that stores appointments.
2. Real availability from that system, instead of the sample slots in `booking.js`.
3. Confirmation emails or messages sent from the server.
4. Spam protection, a privacy policy and consent text, and HTTPS hosting.
5. Optionally, payments through a provider such as Stripe, with the studio's own account.

Images in the HTML come from Unsplash. To use local photos, put them in `assets/images/` and change the `src` values (the treatment photos are in `js/config.js`).
