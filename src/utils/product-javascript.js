/**
 * Product utilities used by an e-commerce product page
 * API Source: https://dummyjson.com/products
 */

const LOW_STOCK_THRESHOLD = 10;

/**
 * Groups products by category
 * @param {Array} products
 * @returns {Object}
 */
export function groupProductsByCategory(products) {
  if (!products || !products.length) return {};

  return products.reduce((acc, product) => {
    const category = product.category || "unknown";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(product);
    return acc;
  }, {});
}

/**
 * Calculates total price of all products
 * @param {Array} products
 * @returns {number}
 */
export function calculateTotalPrice(products) {
  if (!Array.isArray(products)) return 0;

  return products.reduce((sum, product) => {
    return sum + (product.price || 0);
  }, 0);
}

/**
 * Filters low stock products
 * @param {Array} products
 * @param {number} threshold
 * @returns {Array}
 */
export function getLowStockProducts(products, threshold = LOW_STOCK_THRESHOLD) {
  if (!products) return [];

  return products.filter((product) => {
    return product.stock < threshold;
  });
}

/**
 * Fetch products from API
 * @returns {Promise}
 */
export async function fetchProducts() {
  const response = await fetch("https://dummyjson.com/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return data.products;
}

/**
 * Debounce utility
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * Checks in-store availability
 * @param {Object} product
 * @param {string|number} pincode
 * @returns {Promise}
 */
export async function checkStoreAvailability(product, pincode) {
  if (!product || !pincode) {
    return null;
  }

  const response = await fetch(
    `https://fakestoreapi.com/products/${product.id}`
  );

  const storeData = await response.json();

  return {
    productId: product.id,
    pincode,
    stores: storeData?.stores || [],
  };
}
