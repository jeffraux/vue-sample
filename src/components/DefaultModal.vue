<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps({
  show: Boolean,
})

const focus = ref<HTMLDialogElement | null>(null)

onMounted(() => {
  focus.value?.focus()
})
</script>

<template>
  <Transition name="modal">
    <dialog v-if="show" class="modal-mask" @keydown.esc="$emit('close')">
      <div ref="focus" class="modal-container">
        <!-- <div class="modal-header">
          <slot name="header">Default header</slot>
        </div> -->
        <div class="modal-body">
          <slot name="body">Default body</slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <!-- Default footer -->
            <button
              class="modal-default-button"
              @click="$emit('close')"
            >OK</button>
          </slot>
        </div>
      </div>
    </dialog>
  </Transition>
</template>

<style>
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
}
.modal-container {
  width: 300px;
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