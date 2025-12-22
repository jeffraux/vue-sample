<script setup lang="ts">
import { computed } from 'vue'
import { VueSpinner } from 'vue3-spinners'
const props = defineProps({
  btnLabel: {
    type: String,
  },
  variant: {
    type: String,
    validator(value: string) {
      return ['primary', 'secondary', 'danger'].includes(value)
    }
  },
  loading: {
    type: Boolean,
  },
})

const variantClass = computed(() => {
  return `btn-${props.variant}`
})
</script>

<template>
  <button :class="['btn', variantClass]">
    <div v-if="loading">
      <VueSpinner size="14" color="white" />
    </div>
    <div v-else>
      {{ btnLabel }}
    </div>
  </button>
</template>

<style scoped>
  .btn {
    padding: 8px 12px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  .btn:hover {
    opacity: 0.8;
  }
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  .btn-danger {
    background-color: #dc3545;
    color: white;
  }
</style>
