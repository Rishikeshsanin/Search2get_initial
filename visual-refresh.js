(() => {
  'use strict';

  /*
    Search2Get V3 visual direction.
    The original first-year raster assets remain preserved in Git history while
    the current storefront uses high-resolution editorial photography.
    Sources are documented in IMAGE_CREDITS.md.
  */

  const photos = {
    'hero-1.png': 'https://images.unsplash.com/photo-1763935724265-058bb46ea30f',
    'main.png': 'https://images.unsplash.com/photo-1741604703016-f8e96872fa3b',
    'g1.webp': 'https://images.unsplash.com/photo-1627808170609-d65b9b4029ba',
    'g2.webp': 'https://images.unsplash.com/photo-1579983880984-a202306861b7',
    'g3.webp': 'https://images.unsplash.com/photo-1604545579383-58dbd58dc91c',
    'g4.webp': 'https://images.unsplash.com/photo-1588844319092-d43813cb2303',
    'M1.webp': 'https://images.unsplash.com/photo-1630245680530-4f02f2cdf6b6',
    'M2.webp': 'https://images.unsplash.com/photo-1764698072685-f01c10bd2dca',
    'M3.webp': 'https://images.unsplash.com/photo-1754473397061-e18dc1091855',
    'men1.webp': 'https://images.unsplash.com/photo-1781696916763-677497fdca1c',
    'trend1.webp': 'https://images.unsplash.com/photo-1579983880984-a202306861b7',
    'trend2.webp': 'https://images.unsplash.com/photo-1764698072685-f01c10bd2dca'
  };

  const positions = {
    'hero-1.png': '50% 42%',
    'main.png': '50% 38%',
    'g1.webp': '50% 35%',
    'g2.webp': '50% 36%',
    'g3.webp': '50% 38%',
    'g4.webp': '50% 36%',
    'M1.webp': '50% 38%',
    'M2.webp': '50% 54%',
    'M3.webp': '50% 28%',
    'men1.webp': '50% 48%',
    'trend1.webp': '50% 34%',
    'trend2.webp': '50% 52%'
  };

  const makeUrl = (base, width, quality = 88) => `${base}?auto=format&fit=crop&w=${width}&q=${quality}`;

  function legacyName(src = '') {
    try {
      const clean = src.split('?')[0];
      return clean.slice(clean.lastIndexOf('/') + 1);
    } catch {
      return src;
    }
  }

  function upgradeImage(img) {
    if (!(img instanceof HTMLImageElement) || img.dataset.s2gHq === 'true' || img.dataset.s2gHq === 'fallback') return;

    const fallbackSrc = img.getAttribute('src') || '';
    const original = legacyName(fallbackSrc);
    const base = photos[original];
    if (!base) return;

    img.dataset.s2gHq = 'true';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.style.objectPosition = positions[original] || '50% 50%';

    img.addEventListener('error', () => {
      if (img.dataset.s2gHq !== 'true') return;
      img.dataset.s2gHq = 'fallback';
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      img.src = fallbackSrc;
    }, { once: true });

    img.src = makeUrl(base, 1400);
    img.srcset = [
      `${makeUrl(base, 640, 84)} 640w`,
      `${makeUrl(base, 960, 86)} 960w`,
      `${makeUrl(base, 1400, 88)} 1400w`,
      `${makeUrl(base, 2000, 90)} 2000w`
    ].join(', ');
    img.sizes = img.closest('.hero-frame, .editorial-media, .story-feature')
      ? '(max-width: 720px) 100vw, 55vw'
      : '(max-width: 720px) 50vw, (max-width: 1100px) 33vw, 25vw';

    if (original === 'hero-1.png') {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    } else {
      img.loading = 'lazy';
    }
  }

  function upgrade(root = document) {
    if (root instanceof HTMLImageElement) upgradeImage(root);
    root.querySelectorAll?.('img').forEach(upgradeImage);
  }

  function polishChrome() {
    const announcement = document.querySelector('.announcement');
    if (announcement) announcement.innerHTML = 'Free delivery above ₹1,499 · <strong>New season edit now live</strong>';

    const footerIntro = document.querySelector('.footer-intro p');
    if (footerIntro) footerIntro.textContent = 'A quieter way to discover expressive everyday style—curated edits, quick browsing and the pieces worth coming back to.';

    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom) footerBottom.innerHTML = '<span>© <span id="year"></span> Search2Get.</span><span>Curated fashion · thoughtful digital experience</span>';

    const projectHeading = [...document.querySelectorAll('.footer-col h3')].find((node) => node.textContent.trim() === 'Project');
    if (projectHeading) projectHeading.textContent = 'Behind it';

    const year = document.querySelector('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  upgrade(document);
  polishChrome();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) upgrade(node);
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
