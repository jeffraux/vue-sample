<script setup lang="ts">
import type { PropType } from 'vue'

import type { Product } from '@/utils/product'

defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
  onClick: {
    type: Function,
  },
  loading: {
    type: Boolean,
  },
})
</script>

<template>
  <div class="product-tile">
    <span class="product-category">{{ product.category }}</span>
    {{ product.title }}
  </div>
</template>

<style scoped>
  .product-tile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px;
    padding: 8px;
    background-color: #fff;
    color: #181818;
    height: 100px;
    width: 100%;
  }
  .product-category {
    opacity: 1;
    font-size: 10px;
    color: #414141;
    text-transform: capitalize;
  }
</style>
