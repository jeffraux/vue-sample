<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { VueSpinner } from 'vue3-spinners'

import { useDebouncedRef } from '@/composables/useDebouncedRef'
import type { Product } from '@/utils/product'

import Search from '@/components/SearchInput.vue'
import ProductTile from '@/components/Product/ProductTile.vue'
import ProductModal from '@/components/Product/ProductModal.vue'
import StoreModal from '@/components/Product/StoreModal.vue'

const searchText = useDebouncedRef('', 500)
const loading = ref(false)
const products = ref<Product[]>([])
const productInfo = ref<Product | null>(null)
const stockLevelWarning = ref(10)
const pageSize = ref(20)
const total = ref(0)
const showProductModal = ref(false)
const showStoreModal = ref(false)
const buttonRefs = ref<HTMLElement[]>([])
const btnReturnRef = ref<HTMLElement | null>(null)
const savedIndex = ref(0)

const setButtonRef = (el: HTMLElement) => {
  if (el) {
    buttonRefs.value.push(el);
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const baseUrl = 'https://dummyjson.com/products'
    let params = `?limit=${pageSize.value}`

    if (searchText.value) {
      params = `/search?q=${searchText.value}&limit=${pageSize.value}`
    }

    const response = await fetch(baseUrl + params)
    const data = await response.json()
    products.value = data.products
    total.value = data.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})

watch(searchText, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    fetchProducts()
  }
})

const categories = computed(() => {
  const allCategories = products.value.map(product => product.category)
  return [...new Set(allCategories)]
})

const filteredByCategory = computed(() => {
  return (category: string) => products.value.filter(product => product.category === category)
})

const handleClickProduct = (p: Product) => {
  showProductModal.value = true
  productInfo.value = p
  savedIndex.value = products.value.findIndex(product => product.id === p.id)
}
const handleCloseProductModal = () => {
  showProductModal.value = false
  if (buttonRefs.value && buttonRefs.value.length > 0 && buttonRefs.value[savedIndex.value]) {
    buttonRefs.value[savedIndex.value]?.focus()
  }
}
const handleOpenStoreModal = (btnRef: HTMLElement) => {
  showStoreModal.value = true
  console.log('btnRef', btnRef.textContent)
  btnReturnRef.value = btnRef
}
const handleCloseStoreModal = () => {
  showStoreModal.value = false
  btnReturnRef.value?.focus()
}
</script>

<template>
  <main>
    <div v-if="loading" class="loader">
      <VueSpinner size="20" color="white" />
    </div>
    <div class="products-header">
      <h3>Products</h3>
      <Search v-model="searchText" placeholder="Search for a product"  />
    </div>

    <div v-for="category in categories" :key="category">
      <span class="category-title">{{ category }}</span>
      <div class="products-list">
        <button
          :ref="setButtonRef"
          class="btn-product"
          :key="product.id"
          v-for="product in filteredByCategory(category)"
          @click="handleClickProduct(product)"
        >
          <ProductTile
            :product="product"
            :stock-level-warning="stockLevelWarning"
          />
        </button>
      </div>
    </div>
  </main>

  <ProductModal
    :show="showProductModal"
    :product="productInfo || undefined"
    @close="handleCloseProductModal"
    @open-store-modal="handleOpenStoreModal"
  />
  <StoreModal
    :show="showStoreModal"
    :product="productInfo || undefined"
    @close="handleCloseStoreModal"
  />
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.loader {
  background-color: rgba(0,0,0, 0.3);
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  top: 0px;
}
.btn-product {
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 4px;
}
.btn-product:focus {
  outline: 1px solid #2a8eff;
}
.products-header {
  width: 250px;
}
.products-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.category-title {
  font-size: 14px;
  font-weight: bold;
  text-transform: capitalize;
}
</style>
