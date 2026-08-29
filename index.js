(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const STORAGE = {
    cart: 's2g_cart_v2',
    wishlist: 's2g_wishlist_v2',
    theme: 's2g_theme_v2',
    reviews: 's2g_reviews_v2',
    session: 's2g_session_v2',
    newsletter: 's2g_newsletter_v2',
    messages: 's2g_messages_v2',
  };

  const products = [
    { id: 'w-01', name: 'Sienna Rib Tee', category: 'Women', image: 'g1.webp', price: 699, oldPrice: 899, rating: 4.8, badge: 'Best seller', description: 'Soft rib-knit everyday tee with a clean fitted silhouette and easy stretch.', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
    { id: 'w-02', name: 'Noa Oversized Tee', category: 'Women', image: 'g4.webp', price: 799, oldPrice: 999, rating: 4.7, badge: 'New', description: 'Relaxed oversized shape, dropped shoulders and a soft cotton-touch finish.', sizes: ['XS', 'S', 'M', 'L'] },
    { id: 'w-03', name: 'Vale Graphic Tee', category: 'Women', image: 'g3.webp', price: 649, oldPrice: 849, rating: 4.6, badge: 'Trending', description: 'A statement graphic tee made for laid-back styling, denim and layered looks.', sizes: ['S', 'M', 'L', 'XL'] },
    { id: 'w-04', name: 'Iris Essential Tee', category: 'Women', image: 'g2.webp', price: 599, oldPrice: 749, rating: 4.5, badge: 'Everyday', description: 'A versatile wardrobe staple with a comfortable regular fit and clean neckline.', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
    { id: 'm-01', name: 'Atlas Heavyweight Tee', category: 'Men', image: 'M1.webp', price: 899, oldPrice: 1099, rating: 4.9, badge: 'Top rated', description: 'Structured heavyweight tee with a premium hand-feel and relaxed modern fit.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 'm-02', name: 'Mono Crew Tee', category: 'Men', image: 'M2.webp', price: 699, oldPrice: 899, rating: 4.7, badge: 'Core', description: 'Minimal crew-neck tee with balanced proportions and easy all-day comfort.', sizes: ['S', 'M', 'L', 'XL'] },
    { id: 'm-03', name: 'Drift Relaxed Tee', category: 'Men', image: 'M3.webp', price: 749, oldPrice: 949, rating: 4.6, badge: 'Popular', description: 'Relaxed cotton tee designed for everyday layering and effortless streetwear fits.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 'm-04', name: 'Core Pique Tee', category: 'Men', image: 'men1.webp', price: 649, oldPrice: 799, rating: 4.4, badge: 'Value pick', description: 'Breathable texture, clean finish and an easy regular fit for daily rotation.', sizes: ['S', 'M', 'L', 'XL'] },
  ];

  const icons = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke-linecap="round"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke-linejoin="round"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 7H6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke-linecap="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4" stroke-linecap="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 6 12 12M18 6 6 18" stroke-linecap="round"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
  };

  const safeJSON = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const state = {
    cart: safeJSON(STORAGE.cart, []),
    wishlist: safeJSON(STORAGE.wishlist, []),
    session: safeJSON(STORAGE.session, null),
    filter: 'All',
    search: '',
    sort: 'featured',
  };

  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  const byId = (id) => products.find((product) => product.id === id);

  function currentPage() {
    const file = location.pathname.split('/').pop() || 'index.html';
    if (file === '' || file === '/') return 'home';
    if (file.includes('shop') || file.includes('clothes')) return 'shop';
    if (file.includes('journal') || file.includes('bloger')) return 'journal';
    if (file.includes('reviews') || file.includes('reviewer')) return 'reviews';
    if (file.includes('contact') || file.includes('contacter')) return 'contact';
    if (file.includes('account') || file.includes('login')) return 'login';
    return 'home';
  }

  function renderChrome() {
    const headerHost = $('#site-header');
    const footerHost = $('#site-footer');
    const active = currentPage();

    if (headerHost) {
      headerHost.innerHTML = `
        <div class="announcement">Free delivery on demo orders above ₹1,499 · <strong>Built as a modern frontend showcase</strong></div>
        <header class="site-header" id="siteHeader">
          <div class="container nav-shell">
            <a class="brand" href="index.html" aria-label="Search2Get home">
              <span class="brand-mark" aria-hidden="true"></span>
              <span>Search2<em>Get</em></span>
            </a>
            <nav class="nav-links" id="navLinks" aria-label="Primary navigation">
              <a class="nav-link ${active === 'home' ? 'active' : ''}" href="index.html">Home</a>
              <a class="nav-link ${active === 'shop' ? 'active' : ''}" href="shop.html">Shop</a>
              <a class="nav-link ${active === 'journal' ? 'active' : ''}" href="journal.html">Journal</a>
              <a class="nav-link ${active === 'reviews' ? 'active' : ''}" href="reviews.html">Reviews</a>
              <a class="nav-link ${active === 'contact' ? 'active' : ''}" href="contact.html">Contact</a>
            </nav>
            <div class="header-actions">
              <button class="icon-button" id="themeToggle" type="button" aria-label="Toggle colour theme"></button>
              <a class="icon-button account-link" href="account.html" aria-label="Account">${icons.user}</a>
              <button class="icon-button" id="cartToggle" type="button" aria-label="Open shopping bag">
                ${icons.cart}<span class="badge-count" id="cartCount">0</span>
              </button>
              <button class="icon-button mobile-toggle" id="mobileToggle" type="button" aria-label="Open menu" aria-expanded="false">${icons.menu}</button>
            </div>
          </div>
        </header>`;
    }

    if (footerHost) {
      footerHost.innerHTML = `
        <footer class="site-footer">
          <div class="container">
            <div class="footer-grid">
              <div class="footer-intro">
                <a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true"></span><span>Search2<em>Get</em></span></a>
                <p>A first-year frontend project reimagined as a polished fashion discovery experience—still powered by plain HTML, CSS and JavaScript.</p>
              </div>
              <div class="footer-col"><h3>Explore</h3><a href="shop.html">Shop all</a><a href="shop.html?category=Women">Women</a><a href="shop.html?category=Men">Men</a></div>
              <div class="footer-col"><h3>Discover</h3><a href="journal.html">Journal</a><a href="reviews.html">Reviews</a><a href="contact.html">Contact</a></div>
              <div class="footer-col"><h3>Project</h3><a href="https://github.com/Rishikeshsanin/Search2get_initial" target="_blank" rel="noreferrer">GitHub repository</a><a href="account.html">Demo account</a><a href="index.html#story">The glow-up story</a></div>
            </div>
            <div class="footer-bottom"><span>© <span id="year"></span> Search2Get. Frontend concept project.</span><span>Designed & built with HTML · CSS · JavaScript</span></div>
          </div>
        </footer>`;
    }

    injectOverlays();
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  function injectOverlays() {
    if ($('#cartDrawer')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="drawer-backdrop" id="drawerBackdrop"></div>
      <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping bag" aria-hidden="true">
        <div class="drawer-head"><h2>Your bag</h2><button class="icon-button" id="cartClose" type="button" aria-label="Close shopping bag">${icons.close}</button></div>
        <div class="drawer-body" id="cartBody"></div>
        <div class="drawer-footer" id="cartFooter"></div>
      </aside>
      <div class="modal" id="quickModal" role="dialog" aria-modal="true" aria-label="Product details"><div class="modal-card" id="quickContent"></div></div>
      <div class="modal" id="checkoutModal" role="dialog" aria-modal="true" aria-label="Demo checkout"><div class="modal-card checkout-card" id="checkoutContent"></div></div>
      <div class="toast-stack" id="toastStack" aria-live="polite"></div>`);
  }

  function toast(title, message = '') {
    const stack = $('#toastStack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<strong>${title}</strong>${message ? `<span>${message}</span>` : ''}`;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      setTimeout(() => el.remove(), 220);
    }, 2600);
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE.theme, theme);
    const toggle = $('#themeToggle');
    if (toggle) {
      toggle.innerHTML = theme === 'dark' ? icons.sun : icons.moon;
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  function initTheme() {
    const stored = localStorage.getItem(STORAGE.theme);
    const preferred = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(stored || preferred);
    $('#themeToggle')?.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  }

  function initHeader() {
    const header = $('#siteHeader');
    const nav = $('#navLinks');
    const toggle = $('#mobileToggle');
    const updateHeader = () => header?.classList.toggle('scrolled', scrollY > 8);
    updateHeader();
    addEventListener('scroll', updateHeader, { passive: true });

    toggle?.addEventListener('click', () => {
      const open = nav?.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(Boolean(open)));
      document.body.classList.toggle('menu-open', Boolean(open));
    });
    nav?.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  }

  function updateCounts() {
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const node = $('#cartCount');
    if (node) {
      node.textContent = count;
      node.hidden = count === 0;
    }
  }

  function productCard(product) {
    const wished = state.wishlist.includes(product.id);
    return `
      <article class="product-card reveal" data-product="${product.id}">
        <div class="product-media">
          <span class="product-badge">${product.badge}</span>
          <button class="wishlist-btn ${wished ? 'active' : ''}" type="button" data-wishlist="${product.id}" aria-label="${wished ? 'Remove' : 'Add'} ${product.name} ${wished ? 'from' : 'to'} wishlist" aria-pressed="${wished}">${icons.heart}</button>
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <button class="quick-btn" type="button" data-quick="${product.id}">Quick view</button>
        </div>
        <div class="product-info">
          <div class="product-meta"><div><h3 class="product-title">${product.name}</h3><span class="product-category">${product.category}</span></div><span class="product-price">${money(product.price)}</span></div>
          <div class="product-meta"><span class="rating"><span class="star">★</span>${product.rating} · 120+ looks</span><span class="product-old">${money(product.oldPrice)}</span></div>
        </div>
      </article>`;
  }

  function renderFeatured() {
    const grid = $('#featuredGrid');
    if (!grid) return;
    grid.innerHTML = products.slice(0, 4).map(productCard).join('');
    bindProductActions(grid);
    observeReveals();
  }

  function bindProductActions(root = document) {
    $$('[data-wishlist]', root).forEach((button) => {
      button.addEventListener('click', () => toggleWishlist(button.dataset.wishlist, button));
    });
    $$('[data-quick]', root).forEach((button) => {
      button.addEventListener('click', () => openQuick(button.dataset.quick));
    });
  }

  function toggleWishlist(id, button) {
    const exists = state.wishlist.includes(id);
    state.wishlist = exists ? state.wishlist.filter((item) => item !== id) : [...state.wishlist, id];
    save(STORAGE.wishlist, state.wishlist);
    const product = byId(id);
    if (button) {
      button.classList.toggle('active', !exists);
      button.setAttribute('aria-pressed', String(!exists));
      button.setAttribute('aria-label', `${!exists ? 'Remove' : 'Add'} ${product?.name || 'item'} ${!exists ? 'from' : 'to'} wishlist`);
    }
    toast(!exists ? 'Saved to wishlist' : 'Removed from wishlist', product?.name || '');
  }

  function openQuick(id) {
    const product = byId(id);
    if (!product) return;
    const modal = $('#quickModal');
    const content = $('#quickContent');
    content.innerHTML = `
      <button class="icon-button modal-close" type="button" data-modal-close="quickModal" aria-label="Close">${icons.close}</button>
      <div class="quick-grid">
        <div class="quick-image"><img src="${product.image}" alt="${product.name}"></div>
        <div class="quick-copy">
          <span class="section-kicker">${product.category} · ${product.badge}</span>
          <h2>${product.name}</h2>
          <div class="rating"><span class="star">★</span>${product.rating} rating</div>
          <p>${product.description}</p>
          <div><span class="price-lg">${money(product.price)}</span><span class="product-old">${money(product.oldPrice)}</span></div>
          <div class="size-label">Choose a size</div>
          <div class="size-options">${product.sizes.map((size, index) => `<button class="size-btn ${index === 0 ? 'active' : ''}" type="button" data-size="${size}">${size}</button>`).join('')}</div>
          <div class="quick-actions"><button class="btn btn-primary" type="button" id="quickAdd">Add to bag ${icons.arrow}</button><button class="btn btn-secondary" type="button" id="quickWish" aria-label="Save to wishlist">${icons.heart}</button></div>
          <p class="form-note">Demo storefront: cart, wishlist and checkout state are stored only in your browser.</p>
        </div>
      </div>`;
    $$('.size-btn', content).forEach((button) => button.addEventListener('click', () => {
      $$('.size-btn', content).forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    }));
    $('#quickAdd', content)?.addEventListener('click', () => {
      const size = $('.size-btn.active', content)?.dataset.size || product.sizes[0];
      addToCart(product.id, size);
      closeModal(modal);
      openCart();
    });
    $('#quickWish', content)?.addEventListener('click', () => toggleWishlist(product.id));
    $('[data-modal-close]', content)?.addEventListener('click', () => closeModal(modal));
    openModal(modal);
  }

  function openModal(modal) {
    modal?.classList.add('open');
    document.body.classList.add('modal-open');
    setTimeout(() => $('.modal-close', modal)?.focus(), 10);
  }

  function closeModal(modal) {
    modal?.classList.remove('open');
    if (!$$('.modal.open').length) document.body.classList.remove('modal-open');
  }

  function addToCart(id, size = 'M') {
    const key = `${id}-${size}`;
    const existing = state.cart.find((item) => item.key === key);
    if (existing) existing.qty += 1;
    else state.cart.push({ key, id, size, qty: 1 });
    save(STORAGE.cart, state.cart);
    updateCounts();
    renderCart();
    const product = byId(id);
    toast('Added to bag', `${product?.name || 'Item'} · ${size}`);
  }

  function changeQty(key, delta) {
    const item = state.cart.find((entry) => entry.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) state.cart = state.cart.filter((entry) => entry.key !== key);
    save(STORAGE.cart, state.cart);
    updateCounts();
    renderCart();
  }

  function removeCart(key) {
    state.cart = state.cart.filter((entry) => entry.key !== key);
    save(STORAGE.cart, state.cart);
    updateCounts();
    renderCart();
  }

  function cartTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + (byId(item.id)?.price || 0) * item.qty, 0);
    const shipping = subtotal === 0 || subtotal >= 1499 ? 0 : 99;
    return { subtotal, shipping, total: subtotal + shipping };
  }

  function renderCart() {
    const body = $('#cartBody');
    const footer = $('#cartFooter');
    if (!body || !footer) return;
    if (!state.cart.length) {
      body.innerHTML = `<div class="cart-empty"><div><div style="font-size:2rem;margin-bottom:8px">🛍️</div><strong>Your bag is empty</strong><span>Add a look from the collection to get started.</span></div></div>`;
      footer.innerHTML = `<a class="btn btn-primary" href="shop.html">Explore the collection</a>`;
      return;
    }
    body.innerHTML = state.cart.map((item) => {
      const product = byId(item.id);
      if (!product) return '';
      return `<div class="cart-item"><img src="${product.image}" alt="${product.name}"><div><h3>${product.name}</h3><small>Size ${item.size} · ${money(product.price)}</small><div class="qty"><button type="button" data-qty="${item.key}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button type="button" data-qty="${item.key}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-btn" type="button" data-remove="${item.key}" aria-label="Remove ${product.name}">×</button></div>`;
    }).join('');
    const totals = cartTotals();
    footer.innerHTML = `<div class="total-line"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div><div class="total-line"><span>Delivery</span><strong>${totals.shipping ? money(totals.shipping) : 'Free'}</strong></div><div class="total-line grand"><span>Total</span><span>${money(totals.total)}</span></div><button class="btn btn-primary" id="checkoutButton" type="button">Demo checkout ${icons.arrow}</button><p class="form-note">No payment is processed. This checkout exists to demonstrate the complete frontend flow.</p>`;
    $$('[data-qty]', body).forEach((button) => button.addEventListener('click', () => changeQty(button.dataset.qty, Number(button.dataset.delta))));
    $$('[data-remove]', body).forEach((button) => button.addEventListener('click', () => removeCart(button.dataset.remove)));
    $('#checkoutButton')?.addEventListener('click', openCheckout);
  }

  function openCart() {
    renderCart();
    $('#cartDrawer')?.classList.add('open');
    $('#drawerBackdrop')?.classList.add('open');
    $('#cartDrawer')?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
  }

  function closeCart() {
    $('#cartDrawer')?.classList.remove('open');
    $('#drawerBackdrop')?.classList.remove('open');
    $('#cartDrawer')?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  }

  function initCart() {
    updateCounts();
    renderCart();
    $('#cartToggle')?.addEventListener('click', openCart);
    $('#cartClose')?.addEventListener('click', closeCart);
    $('#drawerBackdrop')?.addEventListener('click', closeCart);
  }

  function openCheckout() {
    closeCart();
    const modal = $('#checkoutModal');
    const host = $('#checkoutContent');
    const totals = cartTotals();
    host.innerHTML = `
      <button class="icon-button modal-close" type="button" data-modal-close="checkoutModal" aria-label="Close">${icons.close}</button>
      <h2>Demo checkout</h2>
      <p class="section-copy" style="margin-bottom:24px">Complete the delivery details to test the storefront flow. Nothing is charged or sent to a server.</p>
      <form id="checkoutForm" class="form-grid">
        <div class="field"><label for="checkoutName">Full name</label><input id="checkoutName" name="name" autocomplete="name" required></div>
        <div class="field"><label for="checkoutPhone">Phone</label><input id="checkoutPhone" name="phone" inputmode="tel" pattern="[0-9+ -]{8,15}" required></div>
        <div class="field full"><label for="checkoutAddress">Delivery address</label><textarea id="checkoutAddress" name="address" required></textarea></div>
        <div class="field"><label for="checkoutCity">City</label><input id="checkoutCity" name="city" required></div>
        <div class="field"><label for="checkoutPin">PIN code</label><input id="checkoutPin" name="pin" inputmode="numeric" pattern="[0-9]{6}" required></div>
        <div class="field full"><button class="btn btn-primary" type="submit">Place demo order · ${money(totals.total)}</button></div>
      </form>`;
    $('[data-modal-close]', host)?.addEventListener('click', () => closeModal(modal));
    $('#checkoutForm', host)?.addEventListener('submit', (event) => {
      event.preventDefault();
      const order = `S2G-${Date.now().toString().slice(-6)}`;
      state.cart = [];
      save(STORAGE.cart, state.cart);
      updateCounts();
      renderCart();
      host.innerHTML = `<div class="success-state"><div class="success-icon">✓</div><h2>Demo order confirmed</h2><p>Your reference is <strong>${order}</strong>. No payment or server request was made.</p><button class="btn btn-primary" type="button" id="doneCheckout">Continue shopping</button></div>`;
      $('#doneCheckout', host)?.addEventListener('click', () => { closeModal(modal); location.href = 'shop.html'; });
    });
    openModal(modal);
  }

  function initCatalog() {
    const grid = $('#catalogGrid');
    if (!grid) return;
    const params = new URLSearchParams(location.search);
    if (['Men', 'Women'].includes(params.get('category'))) state.filter = params.get('category');

    const search = $('#productSearch');
    const sort = $('#sortProducts');
    $$('.filter-chip').forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.filter === state.filter);
      chip.addEventListener('click', () => {
        state.filter = chip.dataset.filter;
        $$('.filter-chip').forEach((item) => item.classList.toggle('active', item === chip));
        renderCatalog();
      });
    });
    search?.addEventListener('input', () => { state.search = search.value.trim().toLowerCase(); renderCatalog(); });
    sort?.addEventListener('change', () => { state.sort = sort.value; renderCatalog(); });
    renderCatalog();
  }

  function renderCatalog() {
    const grid = $('#catalogGrid');
    const summary = $('#catalogSummary');
    if (!grid) return;
    let list = products.filter((product) => (state.filter === 'All' || product.category === state.filter) && (!state.search || `${product.name} ${product.category} ${product.badge}`.toLowerCase().includes(state.search)));
    if (state.sort === 'price-low') list.sort((a, b) => a.price - b.price);
    if (state.sort === 'price-high') list.sort((a, b) => b.price - a.price);
    if (state.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    grid.innerHTML = list.length ? list.map(productCard).join('') : `<div class="empty-state"><strong>No matches yet.</strong><br>Try a broader search or switch the collection filter.</div>`;
    if (summary) summary.textContent = `${list.length} ${list.length === 1 ? 'style' : 'styles'} shown${state.filter !== 'All' ? ` · ${state.filter}` : ''}`;
    bindProductActions(grid);
    observeReveals();
  }

  function initNewsletter() {
    const form = $('#newsletterForm');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = new FormData(form).get('email')?.toString().trim();
      if (!email) return;
      save(STORAGE.newsletter, { email, date: new Date().toISOString() });
      form.reset();
      toast('You’re on the demo list', 'Saved locally in this browser.');
    });
  }

  function initReviewForm() {
    const form = $('#reviewForm');
    const grid = $('#reviewGrid');
    if (!form || !grid) return;
    renderReviews();
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const review = { id: Date.now(), name: String(data.name || 'Guest'), rating: Math.max(1, Math.min(5, Number(data.rating) || 5)), text: String(data.review || '').trim(), date: new Date().toISOString() };
      if (!review.text) return;
      const stored = safeJSON(STORAGE.reviews, []);
      stored.unshift(review);
      save(STORAGE.reviews, stored.slice(0, 12));
      form.reset();
      renderReviews();
      toast('Review added', 'Stored locally as part of this frontend demo.');
    });
  }

  function renderReviews() {
    const grid = $('#reviewGrid');
    if (!grid) return;
    const defaults = [
      { name: 'Aarav', rating: 5, text: 'The new experience feels fast, clear and genuinely easy to browse. The cart flow is a huge upgrade.' },
      { name: 'Maya', rating: 5, text: 'Love the typography and product cards. It finally feels like a real fashion storefront instead of a college mock-up.' },
      { name: 'Kabir', rating: 4, text: 'Search, filters and quick view work smoothly on mobile. The simple stack makes the project story even better.' },
      { name: 'Nisha', rating: 5, text: 'The dark mode and micro-interactions are tasteful, and nothing gets in the way of shopping.' },
      { name: 'Dev', rating: 5, text: 'A strong example of how far plain HTML, CSS and JavaScript can go when the UX is thought through.' },
      { name: 'Tara', rating: 4, text: 'Clean, responsive and surprisingly complete for a frontend-only concept.' },
    ];
    const stored = safeJSON(STORAGE.reviews, []);
    const list = [...stored, ...defaults].slice(0, 9);
    grid.innerHTML = list.map((review) => `<article class="review-card reveal"><div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div><blockquote>“${escapeHTML(review.text)}”</blockquote><div class="review-person"><span class="avatar">${escapeHTML(review.name.charAt(0).toUpperCase())}</span><div><strong>${escapeHTML(review.name)}</strong><span>${review.date ? 'Community review' : 'Demo shopper'}</span></div></div></article>`).join('');
    observeReveals();
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function initContact() {
    const form = $('#contactForm');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const stored = safeJSON(STORAGE.messages, []);
        stored.unshift({ ...data, date: new Date().toISOString() });
        save(STORAGE.messages, stored.slice(0, 10));
        form.reset();
        toast('Message captured', 'Saved locally for this frontend demo.');
      });
    }
    $$('.faq-question').forEach((button) => button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    }));
  }

  function initLogin() {
    const form = $('#loginForm');
    const sessionHost = $('#sessionHost');
    const email = $('#loginEmail');
    const password = $('#loginPassword');
    const toggle = $('#passwordToggle');

    const renderSession = () => {
      if (!sessionHost) return;
      if (!state.session) {
        sessionHost.innerHTML = '';
        return;
      }
      sessionHost.innerHTML = `<div class="session-card"><strong>Signed in locally as ${escapeHTML(state.session.name)}</strong><span>This is a frontend demo session stored only in your browser.</span><button class="btn btn-secondary btn-sm" id="logoutButton" type="button" style="margin-top:12px">Sign out</button></div>`;
      $('#logoutButton')?.addEventListener('click', () => {
        state.session = null;
        localStorage.removeItem(STORAGE.session);
        renderSession();
        toast('Signed out', 'Local demo session cleared.');
      });
    };

    toggle?.addEventListener('click', () => {
      if (!password) return;
      password.type = password.type === 'password' ? 'text' : 'password';
      toggle.setAttribute('aria-label', password.type === 'password' ? 'Show password' : 'Hide password');
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!email?.checkValidity() || !password?.value || password.value.length < 4) {
        toast('Check your details', 'Use a valid email and at least 4 password characters.');
        return;
      }
      const name = email.value.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
      state.session = { email: email.value, name, date: new Date().toISOString() };
      save(STORAGE.session, state.session);
      form.reset();
      renderSession();
      toast('Welcome back', `${name} · local demo session active.`);
    });
    renderSession();
  }

  function initStoryLinks() {
    $$('[data-category-link]').forEach((link) => link.addEventListener('click', () => {
      const category = link.dataset.categoryLink;
      location.href = `shop.html?category=${encodeURIComponent(category)}`;
    }));
  }

  function observeReveals() {
    const items = $$('.reveal:not(.visible)');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -30px' });
    items.forEach((item) => observer.observe(item));
  }

  function initGlobalEvents() {
    $$('.modal').forEach((modal) => modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    }));
    addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      closeCart();
      $$('.modal.open').forEach(closeModal);
      $('#navLinks')?.classList.remove('open');
      document.body.classList.remove('menu-open');
      $('#mobileToggle')?.setAttribute('aria-expanded', 'false');
    });
  }

  function init() {
    renderChrome();
    initTheme();
    initHeader();
    initCart();
    renderFeatured();
    initCatalog();
    initNewsletter();
    initReviewForm();
    initContact();
    initLogin();
    initStoryLinks();
    initGlobalEvents();
    observeReveals();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
