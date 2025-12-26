<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { VueSpinner } from 'vue3-spinners'

import { useDebouncedRef } from '@/composables/useDebouncedRef'
import type { Product } from '@/utils/product'

import Search from '@/components/SearchInput.vue'
import ProductTile from '@/components/Product/ProductTile.vue'
import ProductModal from '@/components/Product/ProductModal.vue'
import StoreModal from '@/components/Product/StoreModal.vue'
import Pagination from '@/components/DefaultPagination.vue'

const searchText = useDebouncedRef('', 500)
const loading = ref(false)
const products = ref<Product[]>([])
const productInfo = ref<Product | null>(null)
const stockLevelWarning = ref(10)
const pageSize = ref(20)
const pageIndex = ref(0)
const total = ref(0)
const showProductModal = ref(false)
const showStoreModal = ref(false)
const btnReturnRef = ref<HTMLElement | null>(null)
const savedIndex = ref(0)

const fetchProducts = async (reinitialize?: boolean, newPageIndex?: number) => {
  loading.value = true
  pageIndex.value = newPageIndex || 0

  try {
    const baseUrl = 'https://dummyjson.com/products'
    let params = `?limit=${pageSize.value}&skip=${(newPageIndex || 0) * pageSize.value}`

    if (searchText.value) {
      if (reinitialize) pageIndex.value = 0
      params = `/search?q=${searchText.value}&limit=${pageSize.value}&skip=${(newPageIndex || 0) * pageSize.value}`
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
  fetchProducts(true)
})

watch(searchText, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    fetchProducts(true)
  }
})

let previousActiveElement: HTMLElement | null = null
const handleClickProduct = (p: Product) => {
  previousActiveElement = document.activeElement as HTMLElement
  showProductModal.value = true
  productInfo.value = p
  savedIndex.value = products.value.findIndex(product => product.id === p.id)
}

const handleCloseProductModal = () => {
  showProductModal.value = false
  nextTick(() => {
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  })
}

const handleOpenStoreModal = (btnRef: HTMLElement) => {
  showStoreModal.value = true
  btnReturnRef.value = btnRef
}

const handleCloseStoreModal = () => {
  showStoreModal.value = false
  btnReturnRef.value?.focus()
}
</script>

<template>
  <main>
    <div class="products-header">
      <h3>Products</h3>
      <Search v-model="searchText" placeholder="Search for a product"  />
    </div>

    <div class="products-list-container">
      <div v-if="loading" class="loader">
        <VueSpinner size="20" color="white" />
      </div>
      <div v-if="products.length == 0" class="products-empty">No products available.</div>
      <div v-else class="products-list">
        <button
          class="btn-product"
          :key="product.id"
          v-for="product in products"
          @click="handleClickProduct(product)"
        >
          <ProductTile
            :product="product"
            :stock-level-warning="stockLevelWarning"
          />
        </button>
      </div>
    </div>

    <Pagination
      v-if="products.length !== 0"
      :page-index="pageIndex"
      :page-size="pageSize"
      :total="total"
      @fetch-data="fetchProducts"
    />
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
  width: 100%;
  box-sizing: border-box;
}

.loader {
  background-color: rgba(0,0,0, 0.3);
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
}

.products-list-container {
  min-height: 400px;
  width: 100%;
  padding: 0 12px;
  box-sizing: border-box;
  position: relative;
}

.btn-product {
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 4px;
  width: 100%;
  background: none;
}
.btn-product:focus {
  outline: 2px solid #2a8eff;
}

.products-header {
  width: 100%;
  max-width: 340px;
  min-width: 200px;
  margin: 0 auto;
}

.products-list {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 12px;
}
@media (min-width: 480px) {
  .products-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 700px) {
  .products-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 950px) {
  .products-list {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (min-width: 1200px) {
  .products-list {
    grid-template-columns: repeat(5, 1fr);
  }
}

.products-empty {
  display: flex;
  min-height: 120px;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #d7d7d7;
  text-align: center;
}

.category-title {
  font-size: 14px;
  font-weight: bold;
  text-transform: capitalize;
  margin: 16px 0 8px 0;
}
</style>
