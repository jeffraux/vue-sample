<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebouncedRef } from '../composables/useDebouncedRef'

import Search from '../components/SearchInput.vue'
import Button from '../components/ButtonBadge.vue'

const searchText = useDebouncedRef('', 500)
const loading = ref(false)
const error = ref('')

const mockAPI = () => {
  // Imitate API call
  error.value = ''
  loading.value = true
  setTimeout(() => {
    loading.value = false
    error.value = 'Failed to fetch data. Please try again.'
  }, 1000)
}

const handleClick = () => {
  console.log('searchText', searchText.value)
  mockAPI()
}

watch(searchText, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    mockAPI()
  }
})
</script>

<template>
  <main>
    Practice Search
    <Search v-model="searchText" :error="error" />
    <Button btnLabel="Search" :onClick="handleClick" variant="primary" :loading="loading" />
    <p>Debounced value: {{ searchText }}</p>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 16rem;
}
</style>
