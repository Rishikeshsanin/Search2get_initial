# Search2Get ✦ Fashion Discovery Storefront

Search2Get is a **responsive fashion discovery storefront** rebuilt from my first-year frontend project.

The original version was written completely by hand in plain HTML, CSS and JavaScript. Instead of replacing those foundations with a framework, this rebuild deliberately keeps the vanilla web stack and shows how far the same fundamentals can be pushed with stronger design systems, state management, accessibility, responsiveness and interaction design.

> **Project evolution:** first-year frontend experiment → polished portfolio-grade storefront.

## ✨ Experience

Search2Get is designed around one idea: **less searching, more finding**.

The current version includes:

- Product-first responsive homepage
- Searchable product catalog
- Men / Women collection filters
- Price and rating sorting
- Product quick-view modal
- Size selection before adding to bag
- Persistent shopping bag
- Quantity controls and calculated totals
- Persistent wishlist
- Complete demo checkout flow with validation
- Light / dark theme support
- Responsive mobile navigation
- Fashion journal / editorial page
- Review publishing demo
- Contact form interaction
- Newsletter interaction
- Local demo account / session flow
- Toast feedback and micro-interactions
- Scroll reveal with reduced-motion support
- Keyboard-friendly modals and drawers
- Semantic HTML and visible focus states
- SEO-oriented titles, descriptions and social metadata
- Custom 404 experience

## 🛍️ Main flows to try

1. Open **Shop** and search for a style.
2. Filter between **Men** and **Women**.
3. Sort by price or rating.
4. Open **Quick view**, select a size and add the item to your bag.
5. Add favourites to the wishlist.
6. Change bag quantities and refresh the page — state persists.
7. Complete the **demo checkout** and view the confirmation state.
8. Toggle light / dark mode and refresh.
9. Publish a local review.
10. Try the contact, newsletter and demo-account interactions.

## 🧠 Why vanilla HTML, CSS and JavaScript?

This project started with those technologies, so the rebuild keeps them intentionally.

The goal is to demonstrate growth in the fundamentals rather than hide an early project behind a framework or template:

- reusable interface patterns
- responsive layout systems
- DOM-driven rendering
- client-side state management
- Web Storage persistence
- accessible interaction patterns
- form validation
- product filtering and sorting
- modal / drawer behaviour
- progressive enhancement
- visual hierarchy and motion design

## 🧰 Tech stack

| Area | Technology |
| --- | --- |
| Structure | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript (ES6+) |
| State | Web Storage API (`localStorage`) |
| Formatting | `Intl.NumberFormat` |
| Deployment | Static-host friendly / Vercel-ready |
| Build tooling | None required |

## 📁 Key pages

| Page | Purpose |
| --- | --- |
| `index.html` | Product-first landing page |
| `shop.html` | Search, filters, sorting and product discovery |
| `journal.html` | Editorial / project storytelling |
| `reviews.html` | Reviews and local publishing demo |
| `contact.html` | Contact interaction |
| `account.html` | Local demo account/session experience |
| `404.html` | Custom not-found page |

Legacy first-year routes are retained as lightweight compatibility redirects so old links do not simply break.

## 🚀 Run locally

No install or build step is required.

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also open `index.html` directly in a browser for most flows.

## 🔒 Demo / privacy note

Search2Get is a **frontend portfolio project**, not a production ecommerce service.

- No real payment is processed.
- No server-side account is created.
- No credentials are transmitted to a backend.
- Cart, wishlist, reviews, newsletter entries and demo-session state are stored locally in the browser.

## 🕰️ Project history

The repository history preserves the original 2023 first-year project, including the hand-written early implementation. That history is intentional: the value of this repository is not only the finished interface, but the visible progression from an early frontend build to a much more complete product experience.

## 👨‍💻 Author

Designed and built by **Rishikesh Munnaluri**.

The original project and the modern rebuild both use hand-written HTML, CSS and JavaScript.
