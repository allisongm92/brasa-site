// js/state/cart.js

export class CartState {
  constructor() {
    this.items = [];
    this.listeners = [];
    this.loadFromStorage();
  }

  // Load cart from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('brasa_cart');
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
      this.items = [];
    }
  }

  // Save cart to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('brasa_cart', JSON.stringify(this.items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }

  // Generate a unique ID based on product ID and its modifiers
  generateItemId(productId, modifiers = {}) {
    const modString = JSON.stringify(modifiers, Object.keys(modifiers).sort());
    // Create a simple hash or base64 to keep it clean (simple btoa works for our case if ascii)
    // For simplicity, just append stringified sorted modifiers
    return `${productId}_${btoa(encodeURIComponent(modString))}`;
  }

  addItem(product, quantity, modifiers = {}) {
    const uniqueId = this.generateItemId(product.id, modifiers);
    const existingItem = this.items.find(item => item.uniqueId === uniqueId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        uniqueId,
        productId: product.id,
        quantity,
        modifiers,
        price: product.price, // Keep base price for reference
      });
    }

    this.saveToStorage();
    this.notifyListeners();
  }

  updateQuantity(uniqueId, delta) {
    const index = this.items.findIndex(item => item.uniqueId === uniqueId);
    if (index !== -1) {
      this.items[index].quantity += delta;
      
      if (this.items[index].quantity <= 0) {
        this.items.splice(index, 1);
      }
      
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  removeItem(uniqueId) {
    this.items = this.items.filter(item => item.uniqueId !== uniqueId);
    this.saveToStorage();
    this.notifyListeners();
  }

  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((total, item) => {
      // Calculate modifier price additions if any (e.g. Extra Cheddar = $1)
      let modifiersCost = 0;
      if (item.modifiers.cheese && item.modifiers.cheese.includes('+')) {
        modifiersCost += 1; // Simplistic approach based on your UI
      }
      return total + ((item.price + modifiersCost) * item.quantity);
    }, 0);
  }

  // Subscribe to changes
  subscribe(listener) {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.items));
  }
}

export const cart = new CartState();
