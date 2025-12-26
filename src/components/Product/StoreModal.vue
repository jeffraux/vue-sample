<script setup lang="ts">
import { type PropType, ref, watch } from 'vue'
import type { Product } from '@/utils/product'

import Button from '../ButtonBadge.vue'
// import ProductInfo from './ProductInfo.vue'

defineProps({
  show: Boolean,
  handleClose: {
    type: Function,
    default: () => null,
  },
  product: {
    type: Object as PropType<Product>
  },
})
defineEmits(['close'])

const STATIC_STORES = [
  {
    id: 1,
    name: 'Store A',
    location: 'New York, NY',
    availability: 'In stock',
  },
  {
    id: 2,
    name: 'Store B',
    location: 'Los Angeles, CA',
    availability: 'In stock',
  },
  {
    id: 3,
    name: 'Store C',
    location: 'Chicago, IL',
    availability: 'In stock',
  },
]

const pinCode = ref('')
const codeError = ref(false)
const inputRef = ref<HTMLElement | null>(null)
const showStores = ref(false)

watch(inputRef, () => {
  inputRef.value?.focus()
})

const handleEnterPin = () => {
  if (pinCode.value === '123456') {
    showStores.value = true
    codeError.value = false
  } else {
    showStores.value = false
    codeError.value = true
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <dialog v-if="show" class="modal-mask" @keydown.esc="$emit('close')">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Check Store Availability</h3>
          </div>
          <div class="modal-body">
            Enter pin code: <input v-model="pinCode" ref="inputRef" name="pin" maxlength="6" />
            <span v-if="codeError" class="code-error">Code is incorrect!</span>
            <div class="store-list" v-if="showStores">
              <div class="store-detail-container" v-for="store in STATIC_STORES" :key="store.id">
                <div class="store-detail">
                  <h3>{{ store.name }}</h3>
                  {{ store.location }}
                </div>
                <div class="store-detail store-detail-right">
                  <span>{{ store.availability }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <Button btnLabel="Check" variant="primary" @click="handleEnterPin" />
            <Button btnLabel="Close" @click="$emit('close')" />
          </div>
        </div>
      </dialog>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
  outline: none;
}
.modal-container {
  width: 400px;
  margin: auto;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-header h3 {
  margin-top: 0;
  color: #000;
  font-weight: 500;
}
.modal-body {
  margin: 12px 0 20px 0;
}
.modal-body input {
  width: 100px;
}
.code-error {
  margin-left: 8px;
  color: red;
  font-size: 12px;
}
.store-list {
  margin: 8px 0;
}
.store-detail-container {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #b3b3b3;
  padding: 8px;
}
.store-detail-container:first-child {
  border-top: 1px solid #b3b3b3;
}
.store-detail {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.store-detail h3 {
  font-weight: bold;
  font-size: 14px;
}
.store-detail-right {
  justify-content: flex-end;
  align-items: flex-end;
}
.modal-default-button {
  float: right;
}
.modal-footer {
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: flex-end;
}
.modal-enter-from {
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>