<script setup lang="ts">
import type { PropType } from 'vue';
import { VueSpinner } from 'vue3-spinners'

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
  <div class="product-tile" v-if="!loading">
    {{ product.title }}
  </div>
  <div v-else>
    <VueSpinner size="20" color="black" />
  </div>
</template>

<style scoped>
  .product-tile {
    cursor: pointer;
    border-radius: 4px;
    padding: 8px;
    background-color: #fff;
    color: #181818;
  }
</style>
