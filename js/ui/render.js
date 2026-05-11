// js/ui/render.js

import { productCatalog } from '../data/catalog.js';
import { translations } from '../data/i18n.js';
import { cart, getItemUnitTotal } from '../state/cart.js';
import { go } from '../main.js';

const DELIVERY_FEE = 3.99;
const FULFILLMENT_MODES = ['pickup', 'delivery'];

export let currentLang = 'pt';
export let selectedProduct = productCatalog[0];
export let currentCategory = 'burgers';
export let fulfillmentMode = 'pickup';

export function setCurrentLang(lang) {
  currentLang = lang;
}

export function setSelectedProduct(product) {
  selectedProduct = product;
}

export function setCurrentCategory(cat) {
  currentCategory = cat;
}

export function setFulfillmentMode(mode) {
  if (!FULFILLMENT_MODES.includes(mode)) return;
  fulfillmentMode = mode;
  syncFulfillmentButtons();
  updateCartTotals();
}

function syncFulfillmentButtons() {
  document.querySelectorAll('[data-fulfillment]').forEach(button => {
    const isSelected = button.dataset.fulfillment === fulfillmentMode;
    button.classList.toggle('selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
}

function getDeliveryFee(subtotal) {
  return subtotal > 0 && fulfillmentMode === 'delivery' ? DELIVERY_FEE : 0;
}

export const t = key => translations[currentLang][key];
export const productText = (product, field) => product[field][currentLang];

function setButtonLabel(button, label) {
  [...button.childNodes].forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) node.remove();
  });
  button.append(` ${label}`);
}

function setLeadingText(button, label) {
  const textNode = [...button.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
  if (textNode) {
    textNode.textContent = `${label} `;
  } else {
    button.prepend(`${label} `);
  }
}

function setText(selector, text) {
  const node = document.querySelector(selector);
  if (node) node.textContent = text;
}

function profileMarkup(product) {
  return `<div class="taste-profile">${product.profile[currentLang].map(item => `<span>${item}</span>`).join('')}</div>`;
}

function meterMarkup(product) {
  return `
    <div class="smash-meter" aria-label="Taste profile for ${productText(product, 'name')}">
      <span><b>Smash</b><i style="--level:${product.smash}%"></i></span>
      <small>${t('heat')}: ${product.heat[currentLang]}</small>
      <small>${t('richness')}: ${product.richness[currentLang]}</small>
    </div>
  `;
}

function getHotCount(id) {
  const hour = new Date().getHours();
  const seed = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return (seed % 7) + (hour % 4) + 2; 
}

export function renderCards(mood = 'classic') {
  const wrap = document.getElementById('popularCards');
  if (!wrap) return;
  const matches = productCatalog.filter(product => product.moods.includes(mood));

  wrap.innerHTML = matches.map(product => `
    <article class="food-card" data-product-id="${product.id}" tabindex="0" role="button">
      <span class="tag">${productText(product, 'tag')}</span>
      <img src="${product.img}" alt="${productText(product, 'name')}" loading="lazy" data-hero-img>
      <div>
        ${(product.tag && (productText(product, 'tag').toLowerCase().includes('vendido') || productText(product, 'tag').toLowerCase().includes('popular'))) ? `<span class="social-proof-label">${translations[currentLang].socialProof}</span>` : ''}
        <h3 data-hero-name>${productText(product, 'name')}</h3>
        ${profileMarkup(product)}
        ${meterMarkup(product)}
        <footer>
          <b>$${product.price}</b>
          <button class="add-btn" aria-label="${t('addLabel')} ${productText(product, 'name')}">+</button>
        </footer>
      </div>
    </article>
  `).join('');
}

export function renderMenu() {
  const wrap = document.getElementById('menuList');
  if (!wrap) return;
  const sectionTitle = document.querySelector('#menu .section-title h2');
  
  const categoriesMap = {
    'burgers': 0,
    'sides': 1,
    'drinks': 2,
    'desserts': 3
  };

  const categories = ['burgers', 'sides', 'drinks', 'desserts'];
  
  wrap.innerHTML = categories.map(cat => {
    const matches = productCatalog.filter(p => p.category === cat);
    return `
      <div class="category-section" data-cat="${cat}">
        ${matches.map(product => `
          <article class="menu-item" data-product-id="${product.id}" tabindex="0" role="button">
            <img src="${product.img}" alt="${productText(product, 'name')}" loading="lazy" data-hero-img>
            <div>
              ${(product.tag && (productText(product, 'tag').toLowerCase().includes('vendido') || productText(product, 'tag').toLowerCase().includes('popular'))) ? `<span class="social-proof-label">${translations[currentLang].socialProof}</span>` : ''}
              <h3 data-hero-name>${productText(product, 'name')}</h3>
              ${product.popular ? `<div class="hot-status">🔥 <b>${getHotCount(product.id)}</b> ${translations[currentLang].hotStatus}</div>` : ''}
              <p>${productText(product, 'desc')}</p>
              <strong>$${product.price}</strong>
            </div>
            <button class="add-btn" aria-label="${t('addLabel')} ${productText(product, 'name')}">+</button>
          </article>
        `).join('')}
      </div>
    `;
  }).join('');

  // Initial title update
  if (sectionTitle) {
    sectionTitle.textContent = translations[currentLang].categories[categoriesMap[currentCategory]];
  }
}

export function populateProduct(product) {
  setSelectedProduct(product);
  const copy = translations[currentLang];
  const productScreen = document.getElementById('product');
  if (!productScreen) return;

  const prodCopy = productScreen.querySelector('.product-copy');
  prodCopy.querySelector('small').textContent = productText(product, 'tag') || copy.signature;
  prodCopy.querySelector('h1').textContent = productText(product, 'name');
  prodCopy.querySelector('strong').textContent = `$${product.price}`;
  prodCopy.querySelector('p').textContent = productText(product, 'desc');

  const productImage = productScreen.querySelector('.product-hero img');
  productImage.src = product.img;
  productImage.alt = productText(product, 'name');

  const tasteGrid = productScreen.querySelectorAll('.taste-grid article');
  product.profile[currentLang].forEach((item, i) => {
    if (tasteGrid[i]) tasteGrid[i].textContent = item;
  });

  const details = productScreen.querySelectorAll('.profile details');
  if (details[1]) {
    const meterSpan = details[1].querySelector('.meter span');
    if (meterSpan) meterSpan.style.width = product.smash + '%';
    const meterP = details[1].querySelector('p');
    if (meterP) {
      meterP.textContent = `${copy.smashMeterText.split(',')[0]}, ${copy.heat || 'heat'}: ${product.heat[currentLang]}, ${copy.richness || 'richness'}: ${product.richness[currentLang]}.`;
    }
  }

  const stickyPrice = productScreen.querySelector('.sticky-cta b');
  if (stickyPrice) stickyPrice.textContent = `$${product.price}`;

  const miniProduct = document.querySelector('.mini-product');
  if (miniProduct) {
    miniProduct.querySelector('img').src = product.img;
    miniProduct.querySelector('img').alt = productText(product, 'name');
    miniProduct.querySelector('h1').textContent = productText(product, 'name');
  }

  updateScreenTotal(productScreen);
  updateScreenTotal(document.getElementById('customize'));
}

export function screenQuantity(screen) {
  if (!screen) return 1;
  return Number(screen.querySelector('.quantity-control b')?.textContent || 1);
}

export function screenExtrasTotal(screen) {
  if (!screen) return 0;
  return [...screen.querySelectorAll('.extra input:checked')]
    .reduce((sum, item) => sum + Number(item.dataset.price || 0), 0);
}

function parsePriceFromText(text) {
  const match = text.match(/\+\$(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function screenChoicesTotal(screen) {
  if (!screen) return 0;
  return [...screen.querySelectorAll('.segmented button.selected')]
    .reduce((sum, button) => sum + parsePriceFromText(button.textContent || ''), 0);
}

export function updateScreenTotal(screen) {
  if (!screen || !selectedProduct) return;
  const total = (selectedProduct.price + screenChoicesTotal(screen) + screenExtrasTotal(screen)) * screenQuantity(screen);
  screen.querySelectorAll('.sticky-cta b, #customPrice, #totalPrice').forEach(node => {
    node.textContent = '$' + total;
  });
}

function removalPrefix() {
  if (currentLang === 'es') return 'Sin';
  if (currentLang === 'en') return 'No';
  return 'Sem';
}

function modifierPriceSuffix(price) {
  return Number(price || 0) > 0 ? ` +$${Number(price).toFixed(2)}` : '';
}

function modifierLines(item) {
  const modifiers = item.modifiers || {};
  const lines = [];

  if (Array.isArray(modifiers.choices)) {
    modifiers.choices.forEach(choice => {
      if (!choice.value) return;
      lines.push(`${choice.label}: ${choice.value}${modifierPriceSuffix(choice.price)}`);
    });
  }

  if (Array.isArray(modifiers.removals)) {
    modifiers.removals.forEach(name => {
      if (name) lines.push(`${removalPrefix()} ${name}`);
    });
  }

  if (Array.isArray(modifiers.extras)) {
    modifiers.extras.forEach(extra => {
      if (!extra.label) return;
      lines.push(`${extra.label}${modifierPriceSuffix(extra.price)}`);
    });
  }

  if (!lines.length) {
    if (modifiers.cheese) lines.push(modifiers.cheese);
    if (modifiers.sauce) lines.push(modifiers.sauce);
    Object.keys(modifiers).forEach(key => {
      if (key.startsWith('no_')) lines.push(`${removalPrefix()} ${key.replace('no_', '')}`);
      if (key.startsWith('extra_')) lines.push(key.replace('extra_', ''));
    });
  }

  return lines;
}

export function renderCartList() {
  const container = document.querySelector('.cart-list');
  const copy = translations[currentLang];
  if (!container) return;

  const items = cart.items;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-smoky">
        <div class="smoky-icon">🍔</div>
        <p>${copy.signature || 'A brasa está acesa.'}<br>Só falta o seu pedido.</p>
        <button class="primary-btn" data-screen="menu" style="width: auto; padding: 0.8rem 2rem;">Ver Cardápio</button>
      </div>
    `;
    // Update checkout button state
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.style.display = 'none';
    }
    
    // Update badge to empty
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = '';
    return;
  }

  // Restore checkout button
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.style.display = '';
    checkoutBtn.style.opacity = '1';
    checkoutBtn.style.pointerEvents = 'all';
  }

  container.innerHTML = items.map(item => {
    const product = productCatalog.find(p => p.id === item.productId);
    if (!product) return '';
    
    const mods = modifierLines(item);
    const modString = mods.length > 0 ? mods.join('<br>') : '';
    const lineTotal = getItemUnitTotal(item) * item.quantity;
    
    return `
      <article class="cart-item">
        <img src="${product.img}" alt="${productText(product, 'name')}" loading="lazy">
        <div class="cart-item-info">
          <h2>${productText(product, 'name')}</h2>
          <p>${modString}</p>
          <strong>$${lineTotal.toFixed(2)}</strong>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control small">
            <button data-qty="minus" data-id="${item.uniqueId}" tabindex="0">-</button>
            <b>${item.quantity}</b>
            <button data-qty="plus" data-id="${item.uniqueId}" tabindex="0">+</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // --- UPSell Logic ---
  const hasSides = items.some(item => {
    const p = productCatalog.find(prod => prod.id === item.productId);
    return p && p.category === 'sides';
  });
  const hasDrinks = items.some(item => {
    const p = productCatalog.find(prod => prod.id === item.productId);
    return p && p.category === 'drinks';
  });

  let upsellHtml = '';
  const upsellItems = [];

  if (!hasSides) {
    const fries = productCatalog.find(p => p.id === 'truffleFries');
    if (fries) upsellItems.push(fries);
  }
  if (!hasDrinks) {
    const coke = productCatalog.find(p => p.id === 'coke');
    if (coke) upsellItems.push(coke);
  }

  if (upsellItems.length > 0) {
    upsellHtml = `
      <div class="upsell-container">
        <h3>${copy.upsellTitle}</h3>
        <div class="upsell-list">
          ${upsellItems.map(p => `
            <div class="upsell-card">
              <img src="${p.img}" alt="${productText(p, 'name')}">
              <div class="upsell-info">
                <h4>${productText(p, 'name')}</h4>
                <span>$${p.price.toFixed(2)}</span>
              </div>
              <button class="add-upsell-btn" data-id="${p.id}">${copy.upsellAdd}</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    container.innerHTML += upsellHtml;
  }
}

export function updateCartTotals() {
  const copy = translations[currentLang];
  const subtotal = cart.getSubtotal();
  const delivery = getDeliveryFee(subtotal);
  const tax = subtotal * 0.08;
  const total = subtotal + delivery + tax;

  const summaryRows = document.querySelectorAll('.summary p');
  if (summaryRows.length >= 4) {
    // We assume the DOM structure: p > span (label), text (value)
    // To safely update just the price text, we can update the last child or specific elements.
    // In our index.html, it's `<p><span>Subtotal</span> $16.00</p>`
    summaryRows[0].innerHTML = `<span>${copy.subtotal}</span> $${subtotal.toFixed(2)}`;
    summaryRows[1].innerHTML = `<span>${copy.deliveryFee}</span> $${delivery.toFixed(2)}`;
    summaryRows[2].innerHTML = `<span>${copy.tax}</span> $${tax.toFixed(2)}`;
    summaryRows[3].innerHTML = `<span>${copy.total}</span> <strong>$${total.toFixed(2)}</strong>`;
  }

  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.innerHTML = `${copy.proceed} $${total.toFixed(2)} -&gt;`;
  }

  const badge = document.getElementById('cartBadge');
  if (badge) {
    const totalItems = cart.getTotalItems();
    badge.textContent = totalItems > 0 ? totalItems : '';
  }
}

export function processWhatsAppCheckout() {
  if (cart.items.length === 0) return;

  const copy = translations[currentLang];
  const phone = '5585996514681';
  let text = `*NOVO PEDIDO - BRASA BURGER* 🍔\n\n`;

  cart.items.forEach(item => {
    const product = productCatalog.find(p => p.id === item.productId);
    const name = product ? productText(product, 'name') : 'Produto';
    
    text += `${item.quantity}x *${name}* - $${(getItemUnitTotal(item) * item.quantity).toFixed(2)}\n`;
    
    modifierLines(item).forEach(mod => {
      text += `  - ${mod}\n`;
    });
  });

  const subtotal = cart.getSubtotal();
  const delivery = getDeliveryFee(subtotal);
  const tax = subtotal * 0.08;
  const total = subtotal + delivery + tax;

  text += `Tipo de pedido: ${fulfillmentMode === 'delivery' ? copy.delivery : copy.pickup}\n`;
  text += `\n*RESUMO*\n`;
  text += `Subtotal: $${subtotal.toFixed(2)}\n`;
  text += `Taxa de Entrega: $${delivery.toFixed(2)}\n`;
  text += `Impostos: $${tax.toFixed(2)}\n`;
  text += `*Total: $${total.toFixed(2)}*\n`;

  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  
  // Clear cart and show success screen
  cart.clearCart();
  go('success');
  fireFryExplosion();
}

function fireFryExplosion() {
  const fryCount = 40;
  const emojis = ['🍟', '🍟', '🍟', '🍔', '🥓']; // Predominantly fries

  for (let i = 0; i < fryCount; i++) {
    const fry = document.createElement('div');
    fry.className = 'fry-particle';
    fry.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    const startX = Math.random() * window.innerWidth;
    const duration = 2 + Math.random() * 2;
    const delay = Math.random() * 1.5;
    
    fry.style.left = `${startX}px`;
    fry.style.animationDuration = `${duration}s`;
    fry.style.animationDelay = `${delay}s`;
    
    document.body.appendChild(fry);
    
    setTimeout(() => fry.remove(), (duration + delay) * 1000);
  }
}

export function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  
  container.appendChild(toast);
  
  // Animation handles most of it, but we clean up the DOM
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 3200);
}

export function applyLanguage(lang) {
  setCurrentLang(lang);
  const copy = translations[lang];
  const brasaDouble = productCatalog[0];
  const fries = productCatalog[1];

  document.documentElement.lang = copy.htmlLang;
  const languageToggle = document.getElementById('languageToggle');
  
  const langCodeEl = document.getElementById('languageCode');
  if(langCodeEl) langCodeEl.textContent = copy.code;
  
  if (languageToggle) languageToggle.setAttribute('aria-label', copy.languageLabel);
  
  const brand = document.querySelector('.brand');
  if (brand) brand.setAttribute('aria-label', copy.brandAria);
  
  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) cartIcon.setAttribute('aria-label', copy.cartAria);
  
  document.querySelectorAll('[data-lang-option]').forEach(button => {
    button.classList.toggle('active', button.dataset.langOption === lang);
  });

  document.querySelectorAll('.fulfillment').forEach(group => {
    const b1 = group.querySelector('button:nth-child(1) b');
    const b2 = group.querySelector('button:nth-child(2) b');
    if(b1) b1.textContent = copy.pickup;
    if(b2) b2.textContent = copy.delivery;
  });
  syncFulfillmentButtons();
  
  const cartFulfillmentBtn1Small = document.querySelector('#cart .fulfillment button:nth-child(1) small');
  const cartFulfillmentBtn2Small = document.querySelector('#cart .fulfillment button:nth-child(2) small');
  if (cartFulfillmentBtn1Small) cartFulfillmentBtn1Small.textContent = copy.readyTime;
  if (cartFulfillmentBtn2Small) cartFulfillmentBtn2Small.textContent = copy.deliveryFeeLabel;

  document.querySelectorAll('.hero h1 span').forEach((span, index) => {
    span.textContent = copy.heroWords[index];
  });
  setText('.hero p', copy.heroSubtitle);
  
  const primaryBtn = document.querySelector('.primary');
  if (primaryBtn) setLeadingText(primaryBtn, copy.startOrder);
  
  document.querySelectorAll('.hero-seals span').forEach((span, index) => {
    span.textContent = copy.heroSeals[index];
  });

  document.querySelectorAll('.category-strip').forEach(strip => {
    strip.querySelectorAll('button').forEach((button, index) => setButtonLabel(button, copy.categories[index]));
  });

  setText('.craving-panel h2', copy.cravingTitle);
  document.querySelectorAll('[data-mood]').forEach(button => {
    button.textContent = copy.moods[button.dataset.mood];
  });
  setText('.popular .section-title h2', copy.popularTitle);
  setText('.popular .section-title button', `${copy.viewAll} ->`);

  document.querySelectorAll('.brand-seals article').forEach((article, index) => {
    const b = article.querySelector('b');
    const sm = article.querySelector('small');
    if(b) b.textContent = copy.brandSeals[index][0];
    if(sm) sm.textContent = copy.brandSeals[index][1];
  });

  setText('.feature-card small', copy.signature);
  setText('.feature-card h2', productText(brasaDouble, 'name'));
  setText('.feature-card p', productText(brasaDouble, 'desc'));
  setText('.feature-card b', `${copy.viewDetails} ->`);
  setText('#menu .section-title h2', copy.ourBurgers);

  setText('.product-copy small', copy.signature);
  setText('.product-copy h1', productText(brasaDouble, 'name'));
  setText('.product-copy p', productText(brasaDouble, 'desc'));
  setText('.customize-row b', copy.customizeIngredients);
  setText('.customize-row small', copy.customizeSummary);
  document.querySelectorAll('.taste-grid article').forEach((item, index) => {
    item.textContent = brasaDouble.profile[currentLang][index] || brasaDouble.profile[currentLang][0];
  });
  setText('.profile h2', copy.dishProfile);
  const details = document.querySelectorAll('.profile details');
  if (details.length >= 3) {
    details[0].querySelector('summary').textContent = copy.profilePremium;
    details[0].querySelector('p').textContent = copy.profilePremiumText;
    details[1].querySelector('summary').textContent = copy.smashMeter;
    details[1].querySelector('p').textContent = copy.smashMeterText;
    details[2].querySelector('summary').textContent = copy.chefSecret;
    details[2].querySelector('p').textContent = copy.chefSecretText;
  }
  setText('#product .sticky-cta small', copy.total);
  setText('#product .sticky-cta button', copy.addToOrder);

  setText('.mini-product small', copy.customizing);
  setText('.mini-product h1', productText(brasaDouble, 'name'));
  
  document.querySelectorAll('#product, #customize').forEach(root => {
    const optionCards = root.querySelectorAll('.option-card');
    if (optionCards.length < 5) return;
    optionCards[0].querySelector('h2').textContent = copy.cheese;
    optionCards[0].querySelector('p').textContent = copy.cheesePrompt;
    optionCards[0].querySelectorAll('.segmented button').forEach((button, index) => {
      button.textContent = copy.cheeseOptions[index];
    });
    optionCards[1].querySelector('h2').textContent = copy.sauce;
    optionCards[1].querySelector('p').textContent = copy.saucePrompt;
    optionCards[1].querySelectorAll('.segmented button').forEach((button, index) => {
      button.textContent = copy.sauceOptions[index];
    });
    optionCards[2].querySelector('h2').textContent = copy.removeIngredients;
    optionCards[2].querySelector('p').textContent = copy.customizeBurger;
    optionCards[2].querySelectorAll('.toggle-grid label').forEach((label, index) => {
      const textNode = [...label.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = copy.removeOptions[index];
    });
    optionCards[3].querySelector('h2').textContent = copy.extras;
    optionCards[3].querySelector('p').textContent = copy.extrasPrompt;
    optionCards[3].querySelectorAll('.extra').forEach((label, index) => {
      const textNode = [...label.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = ` ${copy.extraOptions[index]} `;
    });
    optionCards[4].querySelector('h2').textContent = copy.quantity;
    optionCards[4].querySelector('p').textContent = copy.quantityPrompt;
  });
  
  setText('#customize .sticky-cta small', copy.total);
  setText('#customize .sticky-cta button', copy.updateOrder);

  setText('.center-title', copy.myOrder);
  
  const promo = document.querySelector('.promo');
  if(promo && promo.childNodes[0]) {
    promo.childNodes[0].textContent = `${copy.promoCode} `;
  }
  setText('.promo span', copy.addCode);
  
  // Update UI components that rely on dynamic translation
  if (selectedProduct) {
    populateProduct(selectedProduct);
  }
  
  renderCards(document.querySelector('.mood-chips .active')?.dataset.mood || 'classic');
  renderMenu();
  renderCartList(); // Re-render cart with new language
  updateCartTotals();

  // Success Screen
  setText('#success h1', copy.orderSent);
  setText('#success p', copy.orderSentDesc);
  setText('#success button', copy.backToMenu);
}
