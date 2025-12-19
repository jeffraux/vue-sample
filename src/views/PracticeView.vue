<script setup lang="ts">
import Button from '../components/ButtonBadge.vue'

const handleClick = () => {
  console.log('Button clicked')
}
</script>

<template>
  <main>
    Practice Buttons
    <Button btnLabel="Default" :onClick="handleClick" />
    <Button btnLabel="Primary" variant="primary" :onClick="handleClick" />
    <Button btnLabel="Secondary" variant="secondary" :onClick="handleClick" />
    <Button btnLabel="Danger" variant="danger" :onClick="handleClick" />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
