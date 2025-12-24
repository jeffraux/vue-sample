<script setup lang="ts">
import { computed } from 'vue'
import Button from './ButtonBadge.vue'

const props = defineProps<{
  pageIndex: number
  pageSize: number
  total: number
}>()

const emit = defineEmits(['fetchData'])

const handleChangePage = (pageIndex?: number) => {
  emit('fetchData', pageIndex)
}

const totalPages = computed(() => {
  const pages = Math.ceil(props.total / props.pageSize)
  const arr = Array.from({ length: pages }, (_, index) => index)
  return arr
})

const showPrevButton = computed(() => {
  return props.pageIndex != 0
})
const showNextButton = computed(() => {
  return props.pageIndex != totalPages.value.length - 1
})
</script>

<template>
  <div class="pagination">
    <div class="pagination-arrow">
      <Button
        v-if="showPrevButton"
        btnLabel="❮"
        variant="default"
        @click="handleChangePage(pageIndex - 1)"
      />
    </div>
    <Button
      v-for="page in totalPages"
      :key="page"
      :btnLabel="`${page + 1}`"
      :variant="pageIndex == page ? 'primary' : 'default'"
      @click="handleChangePage(page)"
    />
    <div class="pagination-arrow">
      <Button
        v-if="showNextButton"
        btnLabel="❯"
        variant="default"
        @click="handleChangePage(pageIndex + 1)"
      />
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-direction: row;
  gap: 6px;
  margin-top: 8px;
}
.pagination-arrow {
  width: 31.5px;
  height: 31.5px;
}
</style>
