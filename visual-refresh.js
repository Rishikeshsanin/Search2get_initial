(() => {
  'use strict';

  /*
    V3 image direction
    ------------------
    The original first-year raster assets remain in Git history, but the current
    experience upgrades them at runtime with high-resolution editorial imagery.
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
    if (!(img instanceof HTMLImageElement) || img.dataset.s2gHq === 'true') return;

    const original = legacyName(img.getAttribute('src') || '');
    const base = photos[original];
    if (!base) return;

    img.dataset.s2gHq = 'true';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
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

  upgrade(document);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) upgrade(node);
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
