<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import type { Product } from '@/utils/product'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
  stockLevelWarning: {
    type: Number,
    default: 10,
  },
})

const defineStockLabelClass = () => {
  return props.product.stock < props.stockLevelWarning ? 'stock-label-warning' : 'stock-label'
}
const isDiscounted = computed(() => {
  return props.product.discountPercentage > 0
})
const totalPrice = computed(() => {
  if (isDiscounted.value) {
    return (props.product.price - ((props.product.discountPercentage / 100) * props.product.price)).toFixed(2)
  }
  return props.product.price.toFixed(2)
})
const stockLabel = computed(() => {
  if (props.product.stock == 0) {
    return 'Out of stock'
  }
  return `${props.product.stock} item${props.product.stock > 1 ? 's' : ''} left`
})
</script>

<template>
  <div class="product-header">
    <span class="product-category">{{ product.category }} · {{ product.brand }}</span>
    {{ product.title }}
  </div>

  <div class="product-info">
    <p>{{ product.description }}</p>
  </div>

  <div class="product-footer">
    <div>
      <span :class="defineStockLabelClass()">{{ stockLabel }}</span>
    </div>
    <div class="product-price">
      <span v-if="isDiscounted" class="price-slashed">${{ product.price }}</span>
      ${{ totalPrice }}
    </div>
  </div>
</template>

<style scoped>
  .product-header {
    display: flex;
    flex-direction: column;
  }
  .product-category {
    opacity: 1;
    font-size: 10px;
    color: #414141;
    text-transform: capitalize;
  }
  .product-info p {
    font-size: 12px;
    margin: 8px 0 16px;
  }
  .product-footer {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
  .product-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .price-slashed {
    font-size: 10px;
    color: #606060;
    text-decoration: line-through;
  }
  .stock-label {
    color: #606060;
    font-size: 10px;
  }
  .stock-label-warning {
    color: red;
    font-size: 10px;
  }
  .hide {
    display: none;
  }
</style>
