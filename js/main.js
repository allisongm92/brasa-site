// js/main.js

import { productCatalog } from './data/catalog.js';
import { cart } from './state/cart.js';
import { 
  applyLanguage, 
  renderCards, 
  renderMenu, 
  setCurrentCategory, 
  currentCategory,
  selectedProduct,
  updateScreenTotal,
  renderCartList,
  updateCartTotals,
  processWhatsAppCheckout,
  showToast,
  currentLang
} from './ui/render.js';
import { translations } from './data/i18n.js';
import { 
  updateHeroExperience, 
  heroTransition, 
  reverseHeroTransition,
  createSparks
} from './ui/animations.js';

export const shell = document.getElementById('app');
export const screens = [...document.querySelectorAll('.screen')];
export let lastScreenBeforeCart = 'home';

export function activeScreenId() {
  return screens.find(screen => screen.classList.contains('active'))?.id || 'home';
}

export function go(id, skipAnim = false) {
  const currentId = activeScreenId();
  if (id === 'cart' && currentId !== 'cart') {
    lastScreenBeforeCart = currentId;
  }

  screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
  const active = document.getElementById(id);
  if (!skipAnim && active) {
    active.classList.remove('screen-enter');
    void active.offsetWidth;
    active.classList.add('screen-enter');
  }
  const behavior = id === 'cart' ? 'auto' : 'smooth';
  shell.scrollTo({ top: 0, behavior });
  window.scrollTo({ top: 0, behavior });
}

// Language Menu
const languageToggle = document.getElementById('languageToggle');
const languageMenu = document.getElementById('languageMenu');

if (languageToggle && languageMenu) {
  languageToggle.addEventListener('click', event => {
    event.stopPropagation();
    const isOpen = !languageMenu.hidden;
    languageMenu.hidden = isOpen;
    languageToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  document.querySelectorAll('[data-lang-option]').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      applyLanguage(button.dataset.langOption);
      languageMenu.hidden = true;
      languageToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', () => {
    languageMenu.hidden = true;
    languageToggle.setAttribute('aria-expanded', 'false');
  });
}

// Scroll animation
if (shell) {
  shell.addEventListener('scroll', updateHeroExperience);
}
window.addEventListener('scroll', updateHeroExperience, { passive: true });

// Form events (Extras)
document.addEventListener('change', event => {
  if (!event.target.matches('.extra input')) return;
  updateScreenTotal(event.target.closest('.screen') || document);
});

// UI interactions
document.addEventListener('click', event => {
  // Segmented buttons
  const segmentedButton = event.target.closest('.segmented button');
  if (segmentedButton) {
    event.preventDefault();
    segmentedButton.parentElement.querySelectorAll('button').forEach(button => button.classList.remove('selected'));
    segmentedButton.classList.add('selected');
    return;
  }

  // Quantity controls
  const quantityButton = event.target.closest('[data-qty]');
  if (quantityButton) {
    event.preventDefault();
    const control = quantityButton.closest('.quantity-control');
    const valueNode = control.querySelector('b');
    
    // Check if it's inside the cart (handled by cart state) or product/customize screen
    const cartItem = quantityButton.closest('.cart-item');
    if (cartItem) {
      // It's in the cart
      const delta = quantityButton.dataset.qty === 'plus' ? 1 : -1;
      const itemId = quantityButton.dataset.id;
      if (itemId) {
        // Add haptic feedback if supported
        if (navigator.vibrate) navigator.vibrate(50);
        cart.updateQuantity(itemId, delta);
      }
      return;
    }

    // It's in the product detail or customize screen
    const next = Math.max(1, Number(valueNode.textContent) + (quantityButton.dataset.qty === 'plus' ? 1 : -1));
    valueNode.textContent = next;
    updateScreenTotal(quantityButton.closest('.screen') || document);
    return;
  }

  // Add to cart buttons (from menu or cards)
  const addButton = event.target.closest('.add-btn');
  if (addButton) {
    event.preventDefault();
    event.stopPropagation();
    handleAddToCart(addButton);
    return;
  }

  // Upsell buttons in cart
  const upsellAddBtn = event.target.closest('.add-upsell-btn');
  if (upsellAddBtn) {
    event.preventDefault();
    const productId = upsellAddBtn.dataset.id;
    const product = productCatalog.find(p => p.id === productId);
    if (product) {
      cart.addItem({
        productId: product.id,
        quantity: 1,
        price: product.price,
        modifiers: {}
      });
      showToast(translations[currentLang].toastAdded);
    }
    return;
  }

  // Add to order (from product detail or customize screen)
  const stickyAddBtn = event.target.closest('.sticky-cta button');
  if (stickyAddBtn && !stickyAddBtn.classList.contains('checkout-btn')) {
    event.preventDefault();
    handleMainAddToCart(stickyAddBtn);
    return;
  }

  // Checkout button
  const checkoutBtn = event.target.closest('.checkout-btn');
  if (checkoutBtn) {
    event.preventDefault();
    processWhatsAppCheckout();
    return;
  }

  // Success screen button
  const successBackBtn = event.target.closest('#success button');
  if (successBackBtn) {
    event.preventDefault();
    go('menu');
    return;
  }

  // Hero transition for products
  const heroSource = event.target.closest('.food-card[data-product-id], .menu-item[data-product-id], .feature-card[data-product-id]');
  if (heroSource) {
    event.preventDefault();
    event.stopPropagation();
    const productId = heroSource.dataset.productId;
    const product = productCatalog.find(p => p.id === productId);
    if (product) {
      heroTransition(heroSource, product);
      return;
    }
  }

  // Categories
  const categoryBtn = event.target.closest('.category-strip button');
  if (categoryBtn) {
    const newCategory = categoryBtn.dataset.category || categoryBtn.dataset.filter || 'burgers';
    const slider = document.getElementById('menuList');
    const targetSection = slider.querySelector(`.category-section[data-cat="${newCategory}"]`);
    
    if (targetSection) {
      slider.scrollTo({ left: targetSection.offsetLeft, behavior: 'smooth' });
    } else {
      // Fallback for home screen quick navigation
      setCurrentCategory(newCategory);
      renderMenu();
      if (categoryBtn.closest('#home')) go('menu');
    }
    return;
  }

  // Moods
  const moodBtn = event.target.closest('[data-mood]');
  if (moodBtn) {
    document.querySelectorAll('[data-mood]').forEach(item => item.classList.remove('active'));
    moodBtn.classList.add('active');
    renderCards(moodBtn.dataset.mood);
    return;
  }

  // Navigation
  const target = event.target.closest('[data-screen]');
  if (target) {
    if (target.classList.contains('back') && activeScreenId() === 'cart') {
      go(lastScreenBeforeCart || 'home');
      return;
    }

    if (target.dataset.screen === 'menu' && target.classList.contains('back') && document.getElementById('product').classList.contains('active')) {
      reverseHeroTransition();
    } else {
      go(target.dataset.screen);
    }
  }
});

// Cart animations and additions
function flyToCart(button) {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const shellRect = shell.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const badgeRect = badge.getBoundingClientRect();
  const particle = document.createElement('span');

  particle.className = 'cart-particle';
  particle.style.setProperty('--start-x', `${buttonRect.left - shellRect.left + buttonRect.width / 2}px`);
  particle.style.setProperty('--start-y', `${buttonRect.top - shellRect.top + buttonRect.height / 2}px`);
  particle.style.setProperty('--end-x', `${badgeRect.left - shellRect.left + badgeRect.width / 2}px`);
  particle.style.setProperty('--end-y', `${badgeRect.top - shellRect.top + badgeRect.height / 2}px`);
  shell.appendChild(particle);
  particle.addEventListener('animationend', () => particle.remove(), { once: true });
}

function triggerCartBadgeBump() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');
}

function handleAddToCart(button) {
  // Haptic feedback
  if (navigator.vibrate) navigator.vibrate(50);
  
  // Find product ID
  const article = button.closest('[data-product-id]');
  if (!article) return;
  const productId = article.dataset.productId;
  const product = productCatalog.find(p => p.id === productId);
  if (!product) return;

  // Add to cart state (no modifiers, quantity 1)
  cart.addItem(product, 1, {});
  showToast(translations[currentLang].toastAdded);

  button.classList.add('added');
  button.textContent = '\u2713'; // Checkmark
  flyToCart(button);

  window.setTimeout(() => {
    button.classList.remove('added');
    button.textContent = '+';
  }, 850);
}

function handleMainAddToCart(button) {
  if (!selectedProduct) return;
  
  if (navigator.vibrate) navigator.vibrate(50);

  const screen = button.closest('.screen') || document.getElementById('product');
  
  // Collect modifiers from the screen
  const modifiers = {};
  
  // If we are in customize screen, read actual modifiers
  // For simplicity, we just check what's selected
  const isCustomize = screen.id === 'customize';
  const root = isCustomize ? document.getElementById('customize') : document.getElementById('product');
  
  const cheeseBtn = root.querySelector('.option-card:nth-child(1) button.selected');
  if (cheeseBtn) modifiers.cheese = cheeseBtn.textContent.trim();
  
  const sauceBtn = root.querySelector('.option-card:nth-child(2) button.selected');
  if (sauceBtn) modifiers.sauce = sauceBtn.textContent.trim();

  root.querySelectorAll('.toggle-grid input[type="checkbox"]').forEach(input => {
    if (!input.checked) {
      const label = input.closest('label').textContent.trim();
      modifiers[`no_${label}`] = true;
    }
  });

  root.querySelectorAll('.extra input[type="checkbox"]').forEach(input => {
    if (input.checked) {
      const label = input.closest('label').textContent.trim();
      modifiers[`extra_${label}`] = true;
    }
  });

  const qty = Number(root.querySelector('.quantity-control b')?.textContent || 1);

  cart.addItem(selectedProduct, qty, modifiers);
  showToast(translations[currentLang].toastAdded);
  triggerCartBadgeBump();

  // Reset qty UI
  const qtyNode = root.querySelector('.quantity-control b');
  if (qtyNode) qtyNode.textContent = 1;
  updateScreenTotal(root);

  go('cart'); // Or just show success toast
}

// Setup Cart Subscription
cart.subscribe((items) => {
  renderCartList();
  updateCartTotals();
});

// Initialization
applyLanguage('pt');

// Slider Sync
const menuList = document.getElementById('menuList');
if (menuList) {
  menuList.addEventListener('scroll', () => {
    const width = menuList.offsetWidth;
    const index = Math.round(menuList.scrollLeft / width);
    const categories = ['burgers', 'sides', 'drinks', 'desserts'];
    const cat = categories[index];
    
    if (cat) {
      setCurrentCategory(cat);
      // Update buttons
      document.querySelectorAll('.category-strip button').forEach(button => {
        const val = button.dataset.category || button.dataset.filter;
        button.classList.toggle('active', val === cat);
      });
      // Update Title
      const title = document.querySelector('#menu .section-title h2');
      if (title) {
        title.textContent = translations[currentLang].categories[index];
      }
    }
  }, { passive: true });
}

// Global Sparks Effect
document.addEventListener('mousedown', (e) => {
  createSparks(e.clientX, e.clientY);
});

document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) {
    createSparks(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });
