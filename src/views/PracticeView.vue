<script setup lang="ts">
import Button from '../components/ButtonBadge.vue'

const handleClick = () => {
  console.log('Button clicked')
}
</script>

<template>
  <main>
    Practice Buttons
    <Button btnLabel="Default" @click="handleClick" />
    <Button btnLabel="Primary" variant="primary" @click="handleClick" />
    <Button btnLabel="Secondary" variant="secondary" @click="handleClick" />
    <Button btnLabel="Danger" variant="danger" @click="handleClick" />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
