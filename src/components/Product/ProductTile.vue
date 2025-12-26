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
    <div class="product-thumbnail">
      <img :src="product.thumbnail" class="product-image" :alt="product.title" />
    </div>
    <div class="product-header">
      <span class="product-category">{{ product.category }}</span>
      <span class="product-title">
        {{ product.title }}
      </span>
    </div>
    <div class="product-footer">
      <div class="product-price">
        <span v-if="isDiscounted" class="price-slashed">${{ product.price }}</span>
        ${{ totalPrice }}
      </div>
      <div>
        <span :class="defineStockLabelClass()">{{ stockLabel }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .product-tile {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 4px;
    padding: 8px;
    background-color: #fff;
    color: #181818;
    min-height: 130px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    transition: box-shadow 0.2s;
  }
  .product-tile:focus,
  .product-tile:hover {
    outline: 2px solid #2196f3;
    box-shadow: 0 2px 10px rgba(33,150,243,0.13);
  }
  .product-thumbnail {
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .product-image {
    height: 100px;
    object-fit: cover;
    display: block;
    margin: 0 auto;
  }
  .product-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    width: 100%;
    margin-top: 6px;
  }
  .product-category {
    opacity: 1;
    font-size: 0.78rem;
    color: #414141;
    text-transform: capitalize;
    margin-bottom: 4px;
  }
  .product-footer {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    margin-top: 4px;
  }
  .product-title {
    min-height: 32px;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 1rem;
    width: 100%;
  }
  .product-price {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1rem;
  }
  .price-slashed {
    font-size: 0.78rem;
    color: #606060;
    text-decoration: line-through;
    margin-right: 4px;
  }
  .stock-warning {
    color: red;
    font-size: 0.78rem;
  }
  .hide {
    display: none;
  }

  @media (max-width: 500px) {
    .product-tile {
      min-height: 100px;
      max-width: 100%;
      font-size: 0.95rem;
      padding: 6px;
    }
    .product-title {
      min-height: 24px;
      font-size: 0.95rem;
    }
    .product-footer {
      font-size: 0.90rem;
    }
    .price-slashed,
    .stock-warning {
      font-size: 0.72rem;
    }
    .product-category {
      font-size: 0.7rem;
    }
  }

  @media (min-width: 501px) and (max-width: 899px) {
    .product-tile {
      font-size: 0.97rem;
      padding: 7px;
    }
    .product-title {
      min-height: 28px;
      font-size: 0.98rem;
    }
  }

  @media (min-width: 900px) {
    .product-tile {
      font-size: 1.06rem;
    }
    .product-title {
      font-size: 1.02rem;
    }
  }
</style>
