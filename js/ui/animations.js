// js/ui/animations.js

import { productText } from './render.js';
import { go } from '../main.js';
import { populateProduct } from './render.js';

let heroAnimating = false;
let lastScrollTop = 0;
let lastSourceCard = null;
export let lastProduct = null;
export let lastSourceScreen = null;

let scrollTimeout;
let lastY = 0;

export function updateHeroExperience() {
  const shell = document.getElementById('app');
  const hero = document.getElementById('hero');
  if (!shell || !hero) return;

  const y = Math.max(shell.scrollTop, window.scrollY || document.documentElement.scrollTop || 0);
  const progress = Math.min(y / 220, 1);
  const burger = document.querySelector('.hero-burger');

  if (burger) {
    burger.style.transform = `translate3d(0, ${progress * 24}px, 0) scale(${1 + progress * .08})`;
  }

  hero.style.setProperty('--hero-progress', progress.toFixed(2));
  hero.classList.toggle('revealed', progress > .18);

  // Fast Scroll Detection for "Fire Glow"
  const currentY = shell.scrollTop;
  const speed = Math.abs(currentY - lastY);
  lastY = currentY;

  if (speed > 50) {
    shell.classList.add('scrolling-fast');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      shell.classList.remove('scrolling-fast');
    }, 200);
  }
}

export function heroTransition(sourceCard, product) {
  if (heroAnimating) return;
  heroAnimating = true;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    populateProduct(product);
    go('product');
    heroAnimating = false;
    return;
  }

  const shell = document.getElementById('app');
  const screens = document.querySelectorAll('.screen');

  lastScrollTop = shell.scrollTop;
  lastSourceCard = sourceCard;
  lastProduct = product;
  lastSourceScreen = sourceCard.closest('.screen')?.id || 'menu';

  const overlay = document.getElementById('heroOverlay');
  const productScreen = document.getElementById('product');
  const nameText = productText(product, 'name');
  const words = nameText.split(/\s+/);

  const srcImg = sourceCard.querySelector('[data-hero-img]');
  const srcName = sourceCard.querySelector('[data-hero-name]');
  if (!srcImg || !srcName) {
    populateProduct(product);
    go('product');
    heroAnimating = false;
    return;
  }

  const srcImgRect = srcImg.getBoundingClientRect();
  const origSrcHTML = srcName.innerHTML;
  srcName.innerHTML = words.map(w => `<span>${w}</span>`).join(' ');
  const srcWordRects = [...srcName.children].map(el => el.getBoundingClientRect());
  srcName.innerHTML = origSrcHTML;
  const srcFontSize = parseFloat(window.getComputedStyle(srcName).fontSize);

  populateProduct(product);
  screens.forEach(s => s.classList.remove('active'));
  productScreen.classList.add('active', 'hero-animating');
  productScreen.style.opacity = '0';
  shell.scrollTo({ top: 0, behavior: 'instant' });
  window.scrollTo({ top: 0, behavior: 'instant' });
  void productScreen.offsetHeight;

  const destImg = productScreen.querySelector('.product-hero img');
  const destName = productScreen.querySelector('.product-copy h1');
  const destImgRect = destImg.getBoundingClientRect();
  const destFontSize = parseFloat(window.getComputedStyle(destName).fontSize);

  const origDestText = destName.textContent;
  destName.innerHTML = words.map(w => `<span>${w}</span>`).join(' ');
  void destName.offsetHeight;
  const destWordRects = [...destName.children].map(el => el.getBoundingClientRect());
  destName.textContent = origDestText;

  const nameScale = destFontSize / srcFontSize;

  const cloneImg = document.createElement('img');
  cloneImg.className = 'hero-clone-img';
  cloneImg.src = product.img;
  cloneImg.style.cssText = `
    position:fixed; top:${srcImgRect.top}px; left:${srcImgRect.left}px;
    width:${srcImgRect.width}px; height:${srcImgRect.height}px;
    object-fit:contain; z-index:101; pointer-events:none;
    border-radius:16px;
  `;
  shell.appendChild(cloneImg);

  const wordClones = words.map((word, i) => {
    const el = document.createElement('div');
    el.className = 'hero-clone-name';
    el.textContent = word;
    el.style.cssText = `
      position:fixed; top:${srcWordRects[i].top}px; left:${srcWordRects[i].left}px;
      font-size:${srcFontSize}px; z-index:102; pointer-events:none;
      transform-origin:0 0;
    `;
    shell.appendChild(el);
    return el;
  });

  const animDuration = 660;
  const nameDelay = 70;
  const animEasing = 'cubic-bezier(.16, 1, .3, 1)';
  overlay.classList.add('active');
  overlay.animate([
    { opacity: 0 },
    { opacity: .72, offset: 0.22 },
    { opacity: .48, offset: 0.72 },
    { opacity: 0 }
  ], { duration: animDuration + 120, easing: 'ease', fill: 'forwards' });

  const imgAnim = cloneImg.animate([
    { top: srcImgRect.top+'px', left: srcImgRect.left+'px', width: srcImgRect.width+'px', height: srcImgRect.height+'px', borderRadius: '16px' },
    { top: destImgRect.top+'px', left: destImgRect.left+'px', width: destImgRect.width+'px', height: destImgRect.height+'px', borderRadius: '0px' }
  ], { duration: animDuration, easing: animEasing, fill: 'forwards' });

  const wordAnims = wordClones.map((el, i) => {
    const dx = destWordRects[i].left - srcWordRects[i].left;
    const dy = destWordRects[i].top - srcWordRects[i].top;
    return el.animate([
      { transform: 'translate(0,0) scale(1)' },
      { transform: `translate(${dx}px,${dy}px) scale(${nameScale})` }
    ], { duration: animDuration - 20, delay: nameDelay, easing: animEasing, fill: 'forwards' });
  });

  setTimeout(() => {
    productScreen.style.transition = 'opacity .3s ease';
    productScreen.style.opacity = '1';
  }, animDuration * 0.34);

  Promise.all([imgAnim.finished, ...wordAnims.map(anim => anim.finished)]).then(() => {
    productScreen.style.transition = '';
    productScreen.style.opacity = '';
    cloneImg.style.visibility = 'hidden';
    wordClones.forEach(el => { el.style.visibility = 'hidden'; });
    productScreen.classList.remove('hero-animating');
    requestAnimationFrame(() => {
      cloneImg.remove();
      wordClones.forEach(el => el.remove());
      overlay.classList.remove('active');
      heroAnimating = false;
    });
  }).catch(err => {
    console.error("Hero animation failed:", err);
    productScreen.style.opacity = '';
    heroAnimating = false;
    overlay.classList.remove('active');
    document.querySelectorAll('.hero-clone-img, .hero-clone-name').forEach(el => el.remove());
  });

  // Safety timeout: reset anyway after 2 seconds if something hangs
  setTimeout(() => {
    if (heroAnimating) {
      heroAnimating = false;
      overlay.classList.remove('active');
      document.querySelectorAll('.hero-clone-img, .hero-clone-name').forEach(el => el.remove());
    }
  }, 2000);
}

export function reverseHeroTransition() {
  if (heroAnimating || !lastSourceCard || !lastProduct) {
    go(lastSourceScreen || 'menu');
    return;
  }
  heroAnimating = true;

  const shell = document.getElementById('app');
  const overlay = document.getElementById('heroOverlay');
  const productScreen = document.getElementById('product');
  const targetScreen = document.getElementById(lastSourceScreen);
  const screens = document.querySelectorAll('.screen');
  const words = productText(lastProduct, 'name').split(/\s+/);

  const destImg = productScreen.querySelector('.product-hero img');
  const destName = productScreen.querySelector('.product-copy h1');
  const srcImgRect = destImg.getBoundingClientRect();
  const srcFontSize = parseFloat(window.getComputedStyle(destName).fontSize);

  const origDestText = destName.textContent;
  destName.innerHTML = words.map(w => `<span>${w}</span>`).join(' ');
  const srcWordRects = [...destName.children].map(el => el.getBoundingClientRect());
  destName.textContent = origDestText;

  screens.forEach(s => s.classList.remove('active'));
  targetScreen.classList.add('active');
  shell.scrollTo({ top: lastScrollTop, behavior: 'instant' });
  window.scrollTo({ top: 0, behavior: 'instant' });
  void targetScreen.offsetHeight;

  const targetImg = lastSourceCard.querySelector('[data-hero-img]');
  const targetName = lastSourceCard.querySelector('[data-hero-name]');
  
  if (!targetImg || !targetName || !document.contains(lastSourceCard)) {
    heroAnimating = false;
    go(lastSourceScreen);
    return;
  }

  const destImgRect = targetImg.getBoundingClientRect();
  const destFontSize = parseFloat(window.getComputedStyle(targetName).fontSize);

  const origSrcText = targetName.textContent;
  targetName.innerHTML = words.map(w => `<span>${w}</span>`).join(' ');
  const destWordRects = [...targetName.children].map(el => el.getBoundingClientRect());
  targetName.textContent = origSrcText;

  const nameScale = destFontSize / srcFontSize;

  const cloneImg = document.createElement('img');
  cloneImg.className = 'hero-clone-img';
  cloneImg.src = lastProduct.img;
  cloneImg.style.cssText = `
    position:fixed; top:${srcImgRect.top}px; left:${srcImgRect.left}px;
    width:${srcImgRect.width}px; height:${srcImgRect.height}px;
    object-fit:contain; z-index:101; pointer-events:none;
    border-radius:0px;
  `;
  shell.appendChild(cloneImg);

  const wordClones = words.map((word, i) => {
    const el = document.createElement('div');
    el.className = 'hero-clone-name';
    el.textContent = word;
    el.style.cssText = `
      position:fixed; top:${srcWordRects[i].top}px; left:${srcWordRects[i].left}px;
      font-size:${srcFontSize}px; z-index:102; pointer-events:none;
      transform-origin:0 0;
    `;
    shell.appendChild(el);
    return el;
  });

  targetImg.style.visibility = 'hidden';
  targetName.style.visibility = 'hidden';

  const animDuration = 620;
  const nameDelay = 45;
  const animEasing = 'cubic-bezier(.16, 1, .3, 1)';
  
  overlay.classList.add('active');
  overlay.animate([
    { opacity: 0 },
    { opacity: .58, offset: 0.24 },
    { opacity: .38, offset: 0.72 },
    { opacity: 0 }
  ], { duration: animDuration + 120, easing: 'ease', fill: 'forwards' });

  const imgAnim = cloneImg.animate([
    { top: srcImgRect.top+'px', left: srcImgRect.left+'px', width: srcImgRect.width+'px', height: srcImgRect.height+'px', borderRadius: '0px' },
    { top: destImgRect.top+'px', left: destImgRect.left+'px', width: destImgRect.width+'px', height: destImgRect.height+'px', borderRadius: '16px' }
  ], { duration: animDuration, easing: animEasing, fill: 'forwards' });

  const wordAnims = wordClones.map((el, i) => {
    const dx = destWordRects[i].left - srcWordRects[i].left;
    const dy = destWordRects[i].top - srcWordRects[i].top;
    return el.animate([
      { transform: 'translate(0,0) scale(1)' },
      { transform: `translate(${dx}px,${dy}px) scale(${nameScale})` }
    ], { duration: animDuration - 20, delay: nameDelay, easing: animEasing, fill: 'forwards' });
  });

  Promise.all([imgAnim.finished, ...wordAnims.map(anim => anim.finished)]).then(() => {
    targetImg.style.visibility = '';
    targetName.style.visibility = '';
    cloneImg.remove();
    wordClones.forEach(el => el.remove());
    requestAnimationFrame(() => {
      overlay.classList.remove('active');
      heroAnimating = false;
    });
  }).catch(() => {
    heroAnimating = false;
    overlay.classList.remove('active');
    document.querySelectorAll('.hero-clone-img, .hero-clone-name').forEach(el => el.remove());
  });

  setTimeout(() => {
    if (heroAnimating) {
      heroAnimating = false;
      overlay.classList.remove('active');
      document.querySelectorAll('.hero-clone-img, .hero-clone-name').forEach(el => el.remove());
    }
  }, 2000);
}

export function createSparks(x, y) {
  const sparkCount = 8;
  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const velocity = 30 + Math.random() * 50;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty('--tx', `${tx}px`);
    spark.style.setProperty('--ty', `${ty}px`);
    
    document.body.appendChild(spark);
    
    // Clean up
    setTimeout(() => spark.remove(), 500);
  }
}
