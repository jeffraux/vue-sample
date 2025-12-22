<script setup lang="ts">
import { type PropType, ref, watch } from 'vue'
import type { Product } from '@/utils/product'

import Button from '../ButtonBadge.vue'
import ProductInfo from './ProductInfo.vue'

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

const focus = ref<HTMLDialogElement | null>(null)

watch(focus, () => {
  focus.value?.focus()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <dialog ref="focus" v-if="show" class="modal-mask" @keydown.esc="$emit('close')">
        <div class="modal-container">
          <div class="modal-body">
            <ProductInfo v-if="product" :product="product" />
          </div>
          <div class="modal-footer">
            <Button btnLabel="Check Availability" variant="primary" @click="$emit('close')" />
            <Button btnLabel="OK" @click="$emit('close')" />
          </div>
        </div>
      </dialog>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .modal-mask {
  position: fixed;
  z-index: 9998;
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
  width: 450px;
  margin: auto;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}
.modal-body {
  margin: 0 0 20px 0;
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