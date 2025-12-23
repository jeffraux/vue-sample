<script setup lang="ts">
import { nextTick, onMounted, ref, watch, computed } from 'vue'
import { VueSpinner } from 'vue3-spinners'

import { useDebouncedRef } from '@/composables/useDebouncedRef'
import type { Product } from '@/utils/product'

import Search from '@/components/SearchInput.vue'
import ProductTile from '@/components/Product/ProductTile.vue'
import ProductModal from '@/components/Product/ProductModal.vue'
import StoreModal from '@/components/Product/StoreModal.vue'
import Button from '@/components/ButtonBadge.vue'

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

const fetchProducts = async () => {
  loading.value = true
  try {
    const baseUrl = 'https://dummyjson.com/products'
    let params = `?limit=${pageSize.value}&skip=${pageIndex.value * pageSize.value}`

    if (searchText.value) {
      pageIndex.value = 0
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

const totalPages = computed(() => {
  const pages = Math.ceil(total.value / pageSize.value)
  const arr = Array.from({ length: pages }, (_, index) => index)
  return arr
})

onMounted(() => {
  fetchProducts()
})

watch(searchText, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    fetchProducts()
  }
})

// const categories = computed(() => {
//   const allCategories = products.value.map(product => product.category)
//   return [...new Set(allCategories)]
// })

// const filteredByCategory = computed(() => {
//   return (category: string) => products.value.filter(product => product.category === category)
// })

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

    <div class="products-list-container">
      <!-- <div v-for="category in categories" :key="category">
        <h4 class="category-title">{{ category }}</h4>
      </div> -->
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

    <div class="pagination">
      <div class="pagination-arrow">
        <Button
          v-if="pageIndex != 0"
          btnLabel="«"
          variant="default"
        />
      </div>
      <Button
        v-for="page in totalPages"
        :key="page"
        :btnLabel="`${page + 1}`"
        :variant="pageIndex == page ? 'primary' : 'default'"
      />
      <div class="pagination-arrow">
        <Button
          v-if="pageIndex != totalPages.length"
          btnLabel="»"
          variant="default"
        />
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
.products-list-container {
  min-height: 620px;
}
.btn-product {
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 4px;
}
.btn-product:focus {
  outline: 2px solid #2a8eff;
}
.products-header {
  width: 250px;
}
.products-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.products-empty {
  display: flex;
  min-height: 200px;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #d7d7d7;
}
.category-title {
  font-size: 14px;
  font-weight: bold;
  text-transform: capitalize;
  margin: 16px 0 8px 0;
}
.pagination {
  display: flex;
  flex-direction: row;
  gap: 6px;
  margin-top: 8px;
}
.pagination-arrow {
  width: 31.5px;
  height: 31.5px;
}
</style>
