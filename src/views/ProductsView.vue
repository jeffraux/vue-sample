<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useDebouncedRef } from '../composables/useDebouncedRef'

import Search from '../components/SearchInput.vue'
import ProductTile from '../components/ProductTile.vue'
import type { Product } from '@/utils/product'

const searchText = useDebouncedRef('', 500)
const loading = ref(false)
const products = ref<Product[]>([])

const fetchProducts = async () => {
  loading.value = true
  try {
    let url = 'https://dummyjson.com/products'

    if (searchText.value) {
      console.log('searchText', searchText.value)
      url += `?q=${searchText.value}`
    }

    const response = await fetch(url)
    const data = await response.json()
    products.value = data.products
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
.products-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
}
.products-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
</style>
