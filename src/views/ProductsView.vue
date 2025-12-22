<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { VueSpinner } from 'vue3-spinners'

import { useDebouncedRef } from '@/composables/useDebouncedRef'
import type { Product } from '@/utils/product'

import Search from '@/components/SearchInput.vue'
import Products from '@/components/Product/ProductTile.vue'
import ProductDetails from '@/components/Product/ProductInfo.vue'
import Modal from '@/components/DefaultModal.vue'
import Button from '@/components/ButtonBadge.vue'

const searchText = useDebouncedRef('', 500)
const loading = ref(false)
const products = ref<Product[]>([])
const productInfo = ref<Product | null>(null)
const stockLevelWarning = ref(10)
const pageSize = ref(20)
const total = ref(0)
const showModal = ref(false)

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
  showModal.value = true
  productInfo.value = p
}
const handleCloseModal = () => {
  showModal.value = false
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
        <Products
          v-for="product in filteredByCategory(category)"
          :key="product.id"
          :product="product"
          :stock-level-warning="stockLevelWarning"
          :onClick="() => handleClickProduct(product)"
        />
      </div>
    </div>
  </main>

  <Teleport to="body">
    <Modal :show="showModal" @close="handleCloseModal">
      <!-- <template #header>
        <h3>{{ productInfo?.title }}</h3>
      </template> -->
      <template #body>
        <ProductDetails v-if="productInfo" :product="productInfo" />
      </template>
      <template #footer>
        <Button btnLabel="Check Availability" variant="primary" @click="handleCloseModal" />
        <Button btnLabel="OK" @click="handleCloseModal" />
      </template>
    </Modal>
  </Teleport>
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
