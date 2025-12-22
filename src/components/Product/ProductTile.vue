<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import type { Product } from '@/utils/product'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
  onClick: {
    type: Function,
    default: () => null,
  },
  loading: {
    type: Boolean,
  },
  stockLevelWarning: {
    type: Number,
    default: 10,
  },
})

const handleClick = () => {
  props.onClick?.()
}

const defineStockLabelClass = () => {
  return props.product.stock < props.stockLevelWarning ? 'stock-warning' : 'hide'
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
  <div class="product-tile" @click="handleClick">
    <div class="product-header">
      <span class="product-category">{{ product.category }}</span>
      {{ product.title }}
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
  </div>
</template>

<style scoped>
  .product-tile {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px;
    padding: 8px;
    background-color: #fff;
    color: #181818;
    min-height: 130px;
    width: 170px;
  }
  .product-tile:focus {
    outline: invert;
  }
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
  .stock-warning {
    color: red;
    font-size: 10px;
  }
  .hide {
    display: none;
  }
</style>
