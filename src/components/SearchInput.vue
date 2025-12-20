<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: 'Search',
  },
  error: {
    type: String
  },
});

const emit = defineEmits(['update:modelValue'])
const internalValue = ref(props.modelValue !== undefined ? props.modelValue : '')

watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined && newValue !== internalValue.value) {
    internalValue.value = newValue
  }
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  internalValue.value = target.value
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div>
    <input
      name="search"
      :value="internalValue"
      @input="handleInput"
      :placeholder="placeholder"
      :className="error ? 'error' : ''"
    />
    <p class="error-label">{{ error }}</p>
  </div>
</template>

<style scoped>
input {
  padding: 6px;
  border-radius: 2px;
  box-shadow: none;
  border: 1px solid #FFF;
  outline: none;
  width: 100%;
}
input:focus {
  outline: none;
}
input.error {
  border: 1px solid red;
}
.error-label {
  font-size: 10px;
  color: red;
  margin-top: 4px;
  padding: 0;
}
</style>
