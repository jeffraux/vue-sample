<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { VueSpinner } from 'vue3-spinners'
import { useDebouncedRef } from '../composables/useDebouncedRef'

import Search from '../components/SearchInput.vue'
import ProductTile from '../components/ProductTile.vue'
import type { Product } from '@/utils/product'

const searchText = useDebouncedRef('', 500)
const loading = ref(false)
const products = ref<Product[]>([])
const pageSize = ref(15)
const total = ref(0)

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

    <div class="products-list">
      <ProductTile v-for="product in products" :key="product.id" :product="product" />
    </div>
  </main>
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
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
</style>
