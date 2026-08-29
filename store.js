(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const API_BASE = 'https://dummyjson.com';
  const APPAREL_CATEGORIES = [
    'mens-shirts', 'mens-shoes', 'mens-watches',
    'tops', 'womens-dresses', 'womens-shoes', 'womens-bags',
    'womens-jewellery', 'womens-watches', 'sunglasses'
  ];

  const CATEGORY_META = {
    'mens-shirts': { segment: 'Men', label: 'Shirts' },
    'mens-shoes': { segment: 'Men', label: 'Shoes' },
    'mens-watches': { segment: 'Accessories', label: 'Men’s watches' },
    tops: { segment: 'Women', label: 'Tops' },
    'womens-dresses': { segment: 'Women', label: 'Dresses' },
    'womens-shoes': { segment: 'Women', label: 'Shoes' },
    'womens-bags': { segment: 'Accessories', label: 'Bags' },
    'womens-jewellery': { segment: 'Accessories', label: 'Jewellery' },
    'womens-watches': { segment: 'Accessories', label: 'Women’s watches' },
    sunglasses: { segment: 'Accessories', label: 'Sunglasses' }
  };

  const STORAGE = {
    cart: 's2g_cart_v4',
    wishlist: 's2g_wishlist_v4',
    theme: 's2g_theme_v4',
    reviews: 's2g_reviews_v4',
    session: 's2g_session_v4',
    newsletter: 's2g_newsletter_v4',
    messages: 's2g_messages_v4'
  };

  const icons = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 7H6" stroke-linecap="round"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke-linecap="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 6 12 12M18 6 6 18" stroke-linecap="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4" stroke-linecap="round"/></svg>'
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
    products: [],
    productMap: new Map(),
    loaded: false,
    loading: false,
    apiError: false,
    cart: safeJSON(STORAGE.cart, []),
    wishlist: safeJSON(STORAGE.wishlist, []),
    session: safeJSON(STORAGE.session, null),
    filter: 'All',
    category: 'All',
    search: '',
    sort: 'featured'
  };

  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  const byId = (id) => state.productMap.get(String(id));
  const currentPage = () => {
    const file = location.pathname.split('/').pop() || 'index.html';
    if (!file || file === 'index.html') return 'home';
    if (file.includes('shop') || file.includes('clothes')) return 'shop';
    if (file.includes('journal') || file.includes('bloger')) return 'journal';
    if (file.includes('reviews') || file.includes('reviewer')) return 'reviews';
    if (file.includes('contact') || file.includes('contacter')) return 'contact';
    if (file.includes('account') || file.includes('login')) return 'account';
    return 'home';
  };

  function roundedINR(usd) {
    const raw = Number(usd || 0) * 84;
    const rounded = Math.max(499, Math.round(raw / 100) * 100 - 1);
    return rounded;
  }

  function sizesFor(category) {
    if (category.includes('shoes')) return ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];
    if (category.includes('watch') || category.includes('bags') || category.includes('jewellery') || category === 'sunglasses') return ['One Size'];
    return ['XS', 'S', 'M', 'L', 'XL'];
  }

  function normalizeProduct(raw) {
    const meta = CATEGORY_META[raw.category] || { segment: 'Accessories', label: raw.category };
    const price = roundedINR(raw.price);
    const discount = Math.max(0, Number(raw.discountPercentage || 0));
    const oldPrice = discount > 0 ? Math.round((price / (1 - Math.min(discount, 45) / 100)) / 100) * 100 - 1 : price;
    const badge = Number(raw.stock) <= 6 ? `Only ${raw.stock} left` : discount >= 15 ? `${Math.round(discount)}% off` : Number(raw.rating) >= 4.5 ? 'Top rated' : 'New season';
    return {
      id: String(raw.id),
      sourceId: raw.id,
      name: raw.title,
      brand: raw.brand || 'Search2Get Edit',
      category: raw.category,
      categoryLabel: meta.label,
      segment: meta.segment,
      description: raw.description || 'A considered everyday piece selected for the Search2Get edit.',
      price,
      oldPrice: Math.max(price, oldPrice),
      rating: Number(raw.rating || 0),
      discount,
      stock: Number(raw.stock || 0),
      availability: raw.availabilityStatus || (Number(raw.stock) > 0 ? 'In Stock' : 'Out of Stock'),
      shipping: raw.shippingInformation || 'Ships in 2–4 business days',
      returnPolicy: raw.returnPolicy || '7 day return policy',
      image: raw.thumbnail || raw.images?.[0] || '',
      images: (raw.images?.length ? raw.images : [raw.thumbnail]).filter(Boolean),
      sizes: sizesFor(raw.category),
      badge
    };
  }

  const fallbackProducts = [
    ['83','Blue & Black Check Shirt','Fashion Trends','mens-shirts',29.99,15.35,3.64,38,'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp'],
    ['85','Man Plaid Shirt','Classic Wear','mens-shirts',34.99,19.5,3.46,82,'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp'],
    ['86','Man Short Sleeve Shirt','Casual Comfort','mens-shirts',19.99,6.83,2.9,2,'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp'],
    ['87','Men Check Shirt','Urban Chic','mens-shirts',27.99,11.38,2.72,95,'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp']
  ].map(([id,title,brand,category,price,discountPercentage,rating,stock,thumbnail]) => normalizeProduct({ id, title, brand, category, price, discountPercentage, rating, stock, thumbnail, images:[thumbnail], description:'A versatile wardrobe piece selected for the Search2Get edit.' }));

  async function fetchCatalog(force = false) {
    if ((state.loaded && !force) || state.loading) return state.products;
    state.loading = true;
    state.apiError = false;
    renderLoadingStates();
    try {
      const responses = await Promise.all(APPAREL_CATEGORIES.map(async (category) => {
        const response = await fetch(`${API_BASE}/products/category/${category}?limit=0`);
        if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
        const payload = await response.json();
        return payload.products || [];
      }));
      const seen = new Set();
      state.products = responses.flat().filter((item) => {
        if (!item?.id || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      }).map(normalizeProduct);
      if (!state.products.length) throw new Error('Empty apparel catalog');
      state.loaded = true;
    } catch (error) {
      console.error('[Search2Get] Catalog API unavailable', error);
      state.products = fallbackProducts;
      state.loaded = true;
      state.apiError = true;
    } finally {
      state.loading = false;
      state.productMap = new Map(state.products.map((product) => [String(product.id), product]));
      state.cart = state.cart.filter((item) => state.productMap.has(String(item.id)));
      save(STORAGE.cart, state.cart);
      renderAfterCatalog();
    }
    return state.products;
  }

  function renderChrome() {
    const active = currentPage();
    const headerHost = $('#site-header');
    const footerHost = $('#site-footer');
    if (headerHost) {
      headerHost.innerHTML = `
        <div class="announcement"><span>NEW DROP</span><span>Free shipping above ₹2,499</span><span>Easy 7-day returns</span></div>
        <header class="site-header" id="siteHeader">
          <div class="shell nav-shell">
            <a class="brand" href="index.html" aria-label="Search2Get home"><img src="assets/search2get-logo.svg" alt="Search2Get"></a>
            <nav class="nav-links" id="navLinks" aria-label="Primary navigation">
              <a class="nav-link ${active === 'home' ? 'active' : ''}" href="index.html">Home</a>
              <a class="nav-link ${active === 'shop' ? 'active' : ''}" href="shop.html">New in</a>
              <a class="nav-link" href="shop.html?segment=Women">Women</a>
              <a class="nav-link" href="shop.html?segment=Men">Men</a>
              <a class="nav-link" href="shop.html?segment=Accessories">Accessories</a>
              <a class="nav-link ${active === 'journal' ? 'active' : ''}" href="journal.html">Journal</a>
            </nav>
            <div class="header-actions">
              <button class="icon-button" id="globalSearch" type="button" aria-label="Search products">${icons.search}</button>
              <button class="icon-button" id="themeToggle" type="button" aria-label="Toggle colour theme"></button>
              <a class="icon-button" href="account.html" aria-label="Account">${icons.user}</a>
              <button class="icon-button cart-button" id="cartToggle" type="button" aria-label="Open bag">${icons.cart}<span class="badge-count" id="cartCount">0</span></button>
              <button class="icon-button mobile-toggle" id="mobileToggle" type="button" aria-label="Open menu" aria-expanded="false">${icons.menu}</button>
            </div>
          </div>
        </header>`;
    }
    if (footerHost) {
      footerHost.innerHTML = `
        <footer class="site-footer">
          <div class="shell footer-grid">
            <div class="footer-brand"><img src="assets/search2get-logo.svg" alt="Search2Get"><p>Better finds, less noise. A curated fashion storefront powered by a live product catalog.</p><div class="footer-badges"><span>API-backed catalog</span><span>Responsive</span><span>Accessible</span></div></div>
            <div class="footer-col"><h3>Shop</h3><a href="shop.html">New arrivals</a><a href="shop.html?segment=Women">Women</a><a href="shop.html?segment=Men">Men</a><a href="shop.html?segment=Accessories">Accessories</a></div>
            <div class="footer-col"><h3>Help</h3><a href="contact.html">Contact</a><a href="contact.html#faq">Shipping & returns</a><a href="contact.html#faq">Size guide</a><a href="reviews.html">Reviews</a></div>
            <div class="footer-col"><h3>Project</h3><a href="journal.html">Build journal</a><a href="https://github.com/Rishikeshsanin/Search2get_initial" target="_blank" rel="noreferrer">GitHub</a><a href="account.html">Account demo</a></div>
          </div>
          <div class="shell footer-bottom"><span>© <span id="year"></span> Search2Get.</span><span>Portfolio storefront · no real payment processing.</span></div>
        </footer>`;
    }
    injectOverlays();
    $('#year') && ($('#year').textContent = new Date().getFullYear());
  }

  function injectOverlays() {
    if ($('#cartDrawer')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="drawer-backdrop" id="drawerBackdrop"></div>
      <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping bag" aria-hidden="true">
        <div class="drawer-head"><div><span class="eyebrow">Your bag</span><h2>Bag</h2></div><button class="icon-button" id="cartClose" type="button" aria-label="Close bag">${icons.close}</button></div>
        <div class="drawer-body" id="cartBody"></div><div class="drawer-footer" id="cartFooter"></div>
      </aside>
      <div class="modal" id="quickModal" role="dialog" aria-modal="true" aria-label="Product details"><div class="modal-card product-modal" id="quickContent"></div></div>
      <div class="modal" id="checkoutModal" role="dialog" aria-modal="true" aria-label="Checkout"><div class="modal-card checkout-card" id="checkoutContent"></div></div>
      <div class="search-overlay" id="searchOverlay" aria-hidden="true"><div class="search-panel"><button class="icon-button search-close" id="searchClose" aria-label="Close search">${icons.close}</button><span class="eyebrow">Find something</span><form id="globalSearchForm"><input id="globalSearchInput" type="search" placeholder="Search shirts, dresses, bags…" autocomplete="off"><button class="btn btn-dark" type="submit">Search ${icons.arrow}</button></form><div class="search-suggestions"><a href="shop.html?segment=Women">Women</a><a href="shop.html?segment=Men">Men</a><a href="shop.html?segment=Accessories">Accessories</a></div></div></div>
      <div class="toast-stack" id="toastStack" aria-live="polite"></div>`);
  }

  function toast(title, message = '') {
    const host = $('#toastStack');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<strong>${escapeHTML(title)}</strong>${message ? `<span>${escapeHTML(message)}</span>` : ''}`;
    host.appendChild(el);
    setTimeout(() => el.classList.add('leaving'), 2600);
    setTimeout(() => el.remove(), 2950);
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE.theme, theme);
    const button = $('#themeToggle');
    if (button) button.innerHTML = theme === 'dark' ? icons.sun : icons.moon;
  }

  function initTheme() {
    const stored = localStorage.getItem(STORAGE.theme);
    const preferred = matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(stored || preferred);
    $('#themeToggle')?.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  }

  function initHeader() {
    const nav = $('#navLinks');
    const toggle = $('#mobileToggle');
    toggle?.addEventListener('click', () => {
      const open = nav?.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(Boolean(open)));
    });
    nav?.addEventListener('click', () => { nav.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false'); });
    $('#globalSearch')?.addEventListener('click', openSearch);
    $('#searchClose')?.addEventListener('click', closeSearch);
    $('#searchOverlay')?.addEventListener('click', (event) => { if (event.target.id === 'searchOverlay') closeSearch(); });
    $('#globalSearchForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const q = $('#globalSearchInput')?.value.trim();
      if (q) location.href = `shop.html?q=${encodeURIComponent(q)}`;
    });
  }

  function openSearch() {
    const overlay = $('#searchOverlay');
    overlay?.classList.add('open');
    overlay?.setAttribute('aria-hidden', 'false');
    setTimeout(() => $('#globalSearchInput')?.focus(), 50);
  }
  function closeSearch() {
    $('#searchOverlay')?.classList.remove('open');
    $('#searchOverlay')?.setAttribute('aria-hidden', 'true');
  }

  function imageTag(product, className = '') {
    return `<img class="${className}" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" decoding="async" data-product-image>`;
  }

  function productCard(product) {
    const wished = state.wishlist.includes(product.id);
    const discount = product.oldPrice > product.price;
    return `<article class="product-card" data-product="${product.id}">
      <div class="product-media">
        <a href="#" class="product-image-link" data-quick="${product.id}" aria-label="View ${escapeHTML(product.name)}">${imageTag(product)}</a>
        <span class="product-badge">${escapeHTML(product.badge)}</span>
        <button class="wishlist-btn ${wished ? 'active' : ''}" type="button" data-wishlist="${product.id}" aria-pressed="${wished}" aria-label="${wished ? 'Remove from' : 'Add to'} wishlist">${icons.heart}</button>
        <button class="quick-add" type="button" data-quick="${product.id}">Quick view</button>
      </div>
      <div class="product-info">
        <div class="product-brand">${escapeHTML(product.brand)}</div>
        <div class="product-title-row"><h3>${escapeHTML(product.name)}</h3><span>${money(product.price)}</span></div>
        <div class="product-sub"><span>${escapeHTML(product.categoryLabel)}</span><span>★ ${product.rating.toFixed(1)}</span></div>
        ${discount ? `<div class="product-saving"><s>${money(product.oldPrice)}</s><span>Save ${Math.round(product.discount)}%</span></div>` : ''}
      </div>
    </article>`;
  }

  function productSkeletons(count = 8) {
    return Array.from({ length: count }, () => '<div class="product-card skeleton-card"><div class="product-media skeleton"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>').join('');
  }

  function renderLoadingStates() {
    $('#featuredGrid') && ($('#featuredGrid').innerHTML = productSkeletons(8));
    $('#catalogGrid') && ($('#catalogGrid').innerHTML = productSkeletons(12));
    $('#heroProducts') && ($('#heroProducts').innerHTML = '<div class="hero-product hero-product-main skeleton"></div><div class="hero-product hero-product-small skeleton"></div><div class="hero-product hero-product-small skeleton"></div>');
  }

  function renderAfterCatalog() {
    renderHeroProducts();
    renderCategoryShowcase();
    renderFeatured();
    renderCatalog();
    updateCounts();
    renderCart();
    if (state.apiError) {
      $('#apiNotice')?.classList.remove('hidden');
    }
  }

  function pick(selector, count = 1) {
    const list = state.products.filter(selector);
    return list.slice(0, count);
  }

  function renderHeroProducts() {
    const host = $('#heroProducts');
    if (!host || !state.products.length) return;
    const candidates = [
      pick((p) => p.category === 'womens-dresses', 1)[0],
      pick((p) => p.category === 'mens-shirts', 1)[0],
      pick((p) => p.category === 'womens-bags', 1)[0]
    ].filter(Boolean);
    while (candidates.length < 3 && state.products[candidates.length]) candidates.push(state.products[candidates.length]);
    host.innerHTML = candidates.map((product, index) => `<button class="hero-product ${index === 0 ? 'hero-product-main' : 'hero-product-small'}" type="button" data-quick="${product.id}">
      ${imageTag(product)}<span><small>${escapeHTML(product.categoryLabel)}</small><strong>${escapeHTML(product.name)}</strong><em>${money(product.price)}</em></span>
    </button>`).join('');
    bindProductActions(host);
  }

  function renderCategoryShowcase() {
    const host = $('#categoryGrid');
    if (!host || !state.products.length) return;
    const entries = [
      ['Women', pick((p) => p.category === 'womens-dresses', 1)[0] || pick((p) => p.segment === 'Women', 1)[0], 'Dresses · tops · footwear'],
      ['Men', pick((p) => p.category === 'mens-shirts', 1)[0] || pick((p) => p.segment === 'Men', 1)[0], 'Shirts · footwear · watches'],
      ['Accessories', pick((p) => p.category === 'womens-bags', 1)[0] || pick((p) => p.segment === 'Accessories', 1)[0], 'Bags · jewellery · sunglasses']
    ];
    host.innerHTML = entries.map(([segment, product, copy], index) => `<a class="category-card" href="shop.html?segment=${encodeURIComponent(segment)}">
      <div class="category-copy"><span>0${index + 1}</span><h3>${segment}</h3><p>${copy}</p><strong>Shop ${segment.toLowerCase()} →</strong></div>
      <div class="category-product">${product ? imageTag(product) : ''}</div>
    </a>`).join('');
  }

  function renderFeatured() {
    const host = $('#featuredGrid');
    if (!host || !state.products.length) return;
    const sorted = [...state.products].sort((a, b) => (b.rating + b.discount / 100) - (a.rating + a.discount / 100));
    host.innerHTML = sorted.slice(0, 8).map(productCard).join('');
    bindProductActions(host);
  }

  function bindProductActions(root = document) {
    $$('[data-wishlist]', root).forEach((button) => button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleWishlist(button.dataset.wishlist, button);
    }));
    $$('[data-quick]', root).forEach((button) => button.addEventListener('click', (event) => {
      event.preventDefault();
      openQuick(button.dataset.quick);
    }));
  }

  function toggleWishlist(id, button) {
    const exists = state.wishlist.includes(String(id));
    state.wishlist = exists ? state.wishlist.filter((item) => item !== String(id)) : [...state.wishlist, String(id)];
    save(STORAGE.wishlist, state.wishlist);
    button?.classList.toggle('active', !exists);
    button?.setAttribute('aria-pressed', String(!exists));
    toast(!exists ? 'Saved to wishlist' : 'Removed from wishlist', byId(id)?.name || '');
  }

  function openQuick(id) {
    const product = byId(id);
    if (!product) return;
    const modal = $('#quickModal');
    const host = $('#quickContent');
    const gallery = product.images.slice(0, 4);
    host.innerHTML = `<button class="icon-button modal-close" type="button" data-close aria-label="Close">${icons.close}</button>
      <div class="product-modal-grid">
        <div class="product-gallery"><div class="product-gallery-main">${imageTag({ ...product, image: gallery[0] || product.image }, 'modal-main-image')}</div><div class="product-thumbs">${gallery.map((src, index) => `<button type="button" class="thumb ${index === 0 ? 'active' : ''}" data-src="${escapeHTML(src)}"><img src="${escapeHTML(src)}" alt="${escapeHTML(product.name)} view ${index + 1}"></button>`).join('')}</div></div>
        <div class="product-detail"><span class="eyebrow">${escapeHTML(product.brand)} · ${escapeHTML(product.categoryLabel)}</span><h2>${escapeHTML(product.name)}</h2>
          <div class="detail-rating"><span>★ ${product.rating.toFixed(1)}</span><span>${product.stock > 0 ? product.availability : 'Out of stock'}</span></div>
          <div class="detail-price"><strong>${money(product.price)}</strong>${product.oldPrice > product.price ? `<s>${money(product.oldPrice)}</s><span>${Math.round(product.discount)}% off</span>` : ''}</div>
          <p class="detail-description">${escapeHTML(product.description)}</p>
          <div class="detail-perks"><span>✓ ${escapeHTML(product.shipping)}</span><span>↺ ${escapeHTML(product.returnPolicy)}</span></div>
          <div class="size-head"><strong>Select size</strong><a href="contact.html#faq">Size guide</a></div>
          <div class="size-options">${product.sizes.map((size, index) => `<button class="size-btn ${index === 0 ? 'active' : ''}" type="button" data-size="${escapeHTML(size)}">${escapeHTML(size)}</button>`).join('')}</div>
          <div class="quick-actions"><button class="btn btn-dark btn-wide" id="quickAdd" type="button" ${product.stock <= 0 ? 'disabled' : ''}>Add to bag ${icons.arrow}</button><button class="btn btn-light" id="quickWish" type="button">${icons.heart}</button></div>
          <div class="secure-note"><span>Secure demo checkout</span><span>Bag saved locally</span><span>No card charged</span></div>
        </div>
      </div>`;
    $$('.thumb', host).forEach((thumb) => thumb.addEventListener('click', () => {
      $('.modal-main-image', host).src = thumb.dataset.src;
      $$('.thumb', host).forEach((item) => item.classList.toggle('active', item === thumb));
    }));
    $$('.size-btn', host).forEach((button) => button.addEventListener('click', () => {
      $$('.size-btn', host).forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    }));
    $('#quickAdd', host)?.addEventListener('click', () => {
      const size = $('.size-btn.active', host)?.dataset.size || product.sizes[0];
      addToCart(product.id, size);
      closeModal(modal);
      openCart();
    });
    $('#quickWish', host)?.addEventListener('click', () => toggleWishlist(product.id));
    $('[data-close]', host)?.addEventListener('click', () => closeModal(modal));
    openModal(modal);
  }

  function openModal(modal) { modal?.classList.add('open'); document.body.classList.add('modal-open'); }
  function closeModal(modal) { modal?.classList.remove('open'); if (!$$('.modal.open').length) document.body.classList.remove('modal-open'); }

  function addToCart(id, size = 'M') {
    const key = `${id}-${size}`;
    const existing = state.cart.find((item) => item.key === key);
    if (existing) existing.qty += 1;
    else state.cart.push({ key, id: String(id), size, qty: 1 });
    save(STORAGE.cart, state.cart);
    updateCounts();
    renderCart();
    toast('Added to bag', `${byId(id)?.name || 'Item'} · ${size}`);
  }

  function updateCounts() {
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const node = $('#cartCount');
    if (node) { node.textContent = count; node.hidden = count === 0; }
  }

  function cartTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + (byId(item.id)?.price || 0) * item.qty, 0);
    const shipping = subtotal === 0 || subtotal >= 2499 ? 0 : 149;
    return { subtotal, shipping, total: subtotal + shipping };
  }

  function changeQty(key, delta) {
    const item = state.cart.find((entry) => entry.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) state.cart = state.cart.filter((entry) => entry.key !== key);
    save(STORAGE.cart, state.cart); updateCounts(); renderCart();
  }

  function removeCart(key) { state.cart = state.cart.filter((entry) => entry.key !== key); save(STORAGE.cart, state.cart); updateCounts(); renderCart(); }

  function renderCart() {
    const body = $('#cartBody');
    const footer = $('#cartFooter');
    if (!body || !footer) return;
    if (!state.cart.length) {
      body.innerHTML = '<div class="cart-empty"><span>Bag is empty</span><strong>Your next favourite is probably one scroll away.</strong><a class="btn btn-dark" href="shop.html">Shop new arrivals</a></div>';
      footer.innerHTML = '';
      return;
    }
    body.innerHTML = state.cart.map((item) => {
      const product = byId(item.id); if (!product) return '';
      return `<div class="cart-item">${imageTag(product)}<div class="cart-item-copy"><span>${escapeHTML(product.brand)}</span><h3>${escapeHTML(product.name)}</h3><small>${escapeHTML(item.size)} · ${money(product.price)}</small><div class="qty"><button data-qty="${item.key}" data-delta="-1">−</button><span>${item.qty}</span><button data-qty="${item.key}" data-delta="1">+</button></div></div><button class="remove-btn" data-remove="${item.key}" aria-label="Remove item">${icons.close}</button></div>`;
    }).join('');
    const totals = cartTotals();
    const remaining = Math.max(0, 2499 - totals.subtotal);
    footer.innerHTML = `<div class="shipping-progress"><div><span>${remaining ? `${money(remaining)} away from free shipping` : 'You unlocked free shipping'}</span><strong>${remaining ? '' : '✓'}</strong></div><i><b style="width:${Math.min(100, totals.subtotal / 2499 * 100)}%"></b></i></div><div class="total-line"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div><div class="total-line"><span>Delivery</span><strong>${totals.shipping ? money(totals.shipping) : 'Free'}</strong></div><div class="total-line grand"><span>Total</span><strong>${money(totals.total)}</strong></div><button class="btn btn-dark btn-wide" id="checkoutButton">Checkout ${icons.arrow}</button><small class="checkout-caption">Demo transaction only · no payment will be taken.</small>`;
    $$('[data-qty]', body).forEach((button) => button.addEventListener('click', () => changeQty(button.dataset.qty, Number(button.dataset.delta))));
    $$('[data-remove]', body).forEach((button) => button.addEventListener('click', () => removeCart(button.dataset.remove)));
    $('#checkoutButton')?.addEventListener('click', openCheckout);
  }

  function openCart() { renderCart(); $('#cartDrawer')?.classList.add('open'); $('#drawerBackdrop')?.classList.add('open'); $('#cartDrawer')?.setAttribute('aria-hidden','false'); }
  function closeCart() { $('#cartDrawer')?.classList.remove('open'); $('#drawerBackdrop')?.classList.remove('open'); $('#cartDrawer')?.setAttribute('aria-hidden','true'); }

  function initCart() {
    $('#cartToggle')?.addEventListener('click', openCart);
    $('#cartClose')?.addEventListener('click', closeCart);
    $('#drawerBackdrop')?.addEventListener('click', closeCart);
  }

  function openCheckout() {
    closeCart();
    const modal = $('#checkoutModal');
    const host = $('#checkoutContent');
    const totals = cartTotals();
    host.innerHTML = `<button class="icon-button modal-close" data-close aria-label="Close">${icons.close}</button><div class="checkout-head"><span class="eyebrow">Checkout</span><h2>Delivery details</h2><p>This is a portfolio checkout simulation. No payment gateway is connected.</p></div>
      <form id="checkoutForm" class="checkout-form"><div class="field"><label>Full name</label><input name="name" autocomplete="name" required></div><div class="field"><label>Phone</label><input name="phone" inputmode="tel" pattern="[0-9+ -]{8,15}" required></div><div class="field full"><label>Address</label><textarea name="address" required></textarea></div><div class="field"><label>City</label><input name="city" required></div><div class="field"><label>PIN code</label><input name="pin" inputmode="numeric" pattern="[0-9]{6}" required></div><div class="field full payment-choice"><span>Payment method</span><label><input type="radio" name="payment" value="COD" checked> Cash on delivery (demo)</label><label><input type="radio" name="payment" value="Card"> Card UI simulation</label></div><div class="checkout-summary full"><div><span>Order total</span><strong>${money(totals.total)}</strong></div><button class="btn btn-dark btn-wide" type="submit">Place demo order ${icons.arrow}</button></div></form>`;
    $('[data-close]', host)?.addEventListener('click', () => closeModal(modal));
    $('#checkoutForm', host)?.addEventListener('submit', (event) => {
      event.preventDefault();
      const order = `S2G-${Date.now().toString().slice(-7)}`;
      state.cart = []; save(STORAGE.cart, state.cart); updateCounts(); renderCart();
      host.innerHTML = `<div class="success-state"><div class="success-icon">✓</div><span class="eyebrow">Order placed</span><h2>Nice find.</h2><p>Demo reference <strong>${order}</strong>. Nothing was charged or transmitted to a payment processor.</p><button class="btn btn-dark" id="doneCheckout">Continue shopping</button></div>`;
      $('#doneCheckout')?.addEventListener('click', () => { closeModal(modal); location.href='shop.html'; });
    });
    openModal(modal);
  }

  function initCatalog() {
    const grid = $('#catalogGrid'); if (!grid) return;
    const params = new URLSearchParams(location.search);
    const segment = params.get('segment');
    const q = params.get('q');
    if (['Women','Men','Accessories'].includes(segment)) state.filter = segment;
    if (q) { state.search = q.toLowerCase(); $('#productSearch') && ($('#productSearch').value = q); }
    $$('.filter-chip').forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.filter === state.filter);
      chip.addEventListener('click', () => { state.filter = chip.dataset.filter; $$('.filter-chip').forEach((item) => item.classList.toggle('active', item === chip)); renderCatalog(); });
    });
    $('#productSearch')?.addEventListener('input', (event) => { state.search = event.target.value.trim().toLowerCase(); renderCatalog(); });
    $('#sortProducts')?.addEventListener('change', (event) => { state.sort = event.target.value; renderCatalog(); });
    $('#categorySelect')?.addEventListener('change', (event) => { state.category = event.target.value; renderCatalog(); });
  }

  function renderCatalog() {
    const grid = $('#catalogGrid'); if (!grid || !state.loaded) return;
    const summary = $('#catalogSummary');
    let list = state.products.filter((product) => {
      const matchesSegment = state.filter === 'All' || product.segment === state.filter;
      const matchesCategory = state.category === 'All' || product.category === state.category;
      const haystack = `${product.name} ${product.brand} ${product.categoryLabel} ${product.segment}`.toLowerCase();
      const matchesSearch = !state.search || haystack.includes(state.search);
      return matchesSegment && matchesCategory && matchesSearch;
    });
    if (state.sort === 'price-low') list.sort((a,b) => a.price - b.price);
    if (state.sort === 'price-high') list.sort((a,b) => b.price - a.price);
    if (state.sort === 'rating') list.sort((a,b) => b.rating - a.rating);
    if (state.sort === 'discount') list.sort((a,b) => b.discount - a.discount);
    if (state.sort === 'featured') list.sort((a,b) => (b.rating + b.discount/100) - (a.rating + a.discount/100));
    grid.innerHTML = list.length ? list.map(productCard).join('') : '<div class="empty-state"><span>No matches</span><strong>Try another search or reset the filters.</strong><button class="btn btn-light" id="resetFilters">Reset filters</button></div>';
    if (summary) summary.innerHTML = `<strong>${list.length}</strong> products${state.filter !== 'All' ? ` · ${state.filter}` : ''}${state.apiError ? ' · fallback catalog' : ''}`;
    $('#resetFilters')?.addEventListener('click', () => { state.filter='All'; state.category='All'; state.search=''; $('#productSearch').value=''; $('#categorySelect').value='All'; $$('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip.dataset.filter==='All')); renderCatalog(); });
    bindProductActions(grid);
  }

  function initNewsletter() {
    $('#newsletterForm')?.addEventListener('submit', (event) => {
      event.preventDefault(); const form = event.currentTarget; const email = new FormData(form).get('email')?.toString().trim(); if (!email) return;
      save(STORAGE.newsletter, { email, date: new Date().toISOString() }); form.reset(); toast('You’re on the list', 'Saved locally for this portfolio demo.');
    });
  }

  function initReviews() {
    const form = $('#reviewForm'); const grid = $('#reviewGrid'); if (!grid) return;
    const seeded = [
      { name:'Maya', rating:5, text:'Clean product cards, quick browsing and the bag flow feels surprisingly complete.' },
      { name:'Aarav', rating:5, text:'The new catalog feels like a store now. Product-first images made the biggest difference.' },
      { name:'Nisha', rating:4, text:'Fast on mobile, clear filters, and the checkout simulation is easy to understand.' }
    ];
    const render = () => { const list = [...safeJSON(STORAGE.reviews, []), ...seeded].slice(0,9); grid.innerHTML = list.map((review) => `<article class="review-card"><div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div><blockquote>“${escapeHTML(review.text)}”</blockquote><div><strong>${escapeHTML(review.name)}</strong><span>${review.date ? 'Community review' : 'Demo shopper'}</span></div></article>`).join(''); };
    render();
    form?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(form)); const review = { id:Date.now(), name:String(data.name||'Guest'), rating:Math.max(1,Math.min(5,Number(data.rating)||5)), text:String(data.review||'').trim(), date:new Date().toISOString() }; if(!review.text) return; const stored=safeJSON(STORAGE.reviews,[]); stored.unshift(review); save(STORAGE.reviews,stored.slice(0,12)); form.reset(); render(); toast('Review added','Saved locally in this browser.'); });
  }

  function initContact() {
    $('#contactForm')?.addEventListener('submit', (event) => { event.preventDefault(); const form=event.currentTarget; const data=Object.fromEntries(new FormData(form)); const stored=safeJSON(STORAGE.messages,[]); stored.unshift({...data,date:new Date().toISOString()}); save(STORAGE.messages,stored.slice(0,10)); form.reset(); toast('Message saved','Frontend demo: nothing was sent over the network.'); });
    $$('.faq-question').forEach((button) => button.addEventListener('click', () => { const item=button.closest('.faq-item'); const open=item.classList.toggle('open'); button.setAttribute('aria-expanded',String(open)); }));
  }

  function initAccount() {
    const form=$('#loginForm'); const host=$('#sessionHost'); const password=$('#loginPassword'); const toggle=$('#passwordToggle');
    const render=()=>{ if(!host) return; host.innerHTML=state.session ? `<div class="session-card"><span>Local session</span><strong>${escapeHTML(state.session.name)}</strong><small>${escapeHTML(state.session.email)}</small><button class="btn btn-light" id="logoutButton">Sign out</button></div>` : ''; $('#logoutButton')?.addEventListener('click',()=>{state.session=null;localStorage.removeItem(STORAGE.session);render();toast('Signed out');}); };
    toggle?.addEventListener('click',()=>{ if(!password) return; password.type=password.type==='password'?'text':'password'; });
    form?.addEventListener('submit',(event)=>{event.preventDefault();const email=$('#loginEmail');if(!email?.checkValidity()||!password?.value||password.value.length<4){toast('Check your details','Use a valid email and a 4+ character password.');return;}const name=email.value.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,(c)=>c.toUpperCase());state.session={email:email.value,name,date:new Date().toISOString()};save(STORAGE.session,state.session);form.reset();render();toast('Welcome back',name);});
    render();
  }

  function placeholderDataURI() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 760"><rect width="640" height="760" fill="#f1eee7"/><path d="M246 190l74-42 74 42 72 54-46 82-38-24v270H258V302l-38 24-46-82 72-54z" fill="#d9d3c7"/><text x="320" y="650" text-anchor="middle" fill="#57534d" font-family="Arial" font-size="22">Search2Get</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function initImageFallbacks() {
    document.addEventListener('error', (event) => {
      const img = event.target;
      if (img instanceof HTMLImageElement && img.hasAttribute('data-product-image') && !img.dataset.fallback) {
        img.dataset.fallback='true'; img.removeAttribute('srcset'); img.src=placeholderDataURI();
      }
    }, true);
  }

  function initGlobalEvents() {
    $$('.modal').forEach((modal) => modal.addEventListener('click', (event) => { if(event.target===modal) closeModal(modal); }));
    addEventListener('keydown',(event)=>{ if(event.key!=='Escape') return; closeCart(); closeSearch(); $$('.modal.open').forEach(closeModal); $('#navLinks')?.classList.remove('open'); });
  }

  async function init() {
    renderChrome(); initTheme(); initHeader(); initCart(); initCatalog(); initNewsletter(); initReviews(); initContact(); initAccount(); initImageFallbacks(); initGlobalEvents(); updateCounts();
    await fetchCatalog();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();