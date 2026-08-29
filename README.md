# Search2Get ✦ Frontend Glow-Up

Search2Get started as my **first-year frontend project**, written by hand in plain HTML, CSS and JavaScript. The original 2023 version is still preserved in this repository's Git history.

This rebuild keeps the same vanilla-web foundation but upgrades the project into a polished, responsive fashion discovery storefront with a complete frontend interaction flow.

## What the new version includes

- Responsive homepage, catalog, journal, reviews, contact and demo-account pages
- Searchable product catalog with Men/Women filters and sorting
- Product quick-view modal with size selection
- Persistent shopping bag with quantity controls and totals
- Persistent wishlist
- Fully interactive **demo checkout** with validation and order confirmation
- Light/dark theme toggle
- Mobile navigation
- Scroll-reveal and micro-interactions with reduced-motion support
- Local review publishing demo
- Local contact/newsletter demos
- Local demo account/session flow
- Keyboard-friendly modal/drawer escape handling
- Semantic HTML, focus states and clearer accessibility labels
- SEO-friendly page titles and descriptions

> **Important:** This is a frontend portfolio project, not a real ecommerce service. No payment is processed, no account is created on a server, and form/cart state is stored only in the browser using `localStorage`.

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Web Storage API (`localStorage`)
- No framework
- No build step
- No backend required

## Run locally

Because the project is fully static, you can open `index.html` directly or use any static server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Main frontend flows to test

1. Browse **Shop** and use search, filters and sorting.
2. Open **Quick view**, select a size and add a product to the bag.
3. Change quantities, refresh the page and confirm the bag persists.
4. Complete the **Demo checkout** and confirm the bag clears.
5. Toggle light/dark mode and refresh.
6. Add a local review on the **Reviews** page.
7. Submit the **Contact** and newsletter demos.
8. Start and clear a local demo session on the **Demo Account** page.

## Project story

The goal of this rebuild was not to hide an early project behind React or a template. It was to show growth in core frontend engineering: layout systems, responsive design, accessibility, state management, interaction design, robustness and visual hierarchy—using the same technologies the project began with.

---

Built by **Rishikesh Munnaluri** as a complete redesign of the original Search2Get first-year frontend project.
