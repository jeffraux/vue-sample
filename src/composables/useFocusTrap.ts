import { customRef } from 'vue'
import type { Ref } from 'vue'

const focusableElementsSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

const useFocusTrap = () => {
  let focusableElements: NodeListOf<HTMLElement> = [] as unknown as NodeListOf<HTMLElement>
  let $firstFocusable: HTMLElement | null = null
  let $lastFocusable: HTMLElement | null = null

  const trapRef: Ref<HTMLElement | null> = customRef<HTMLElement | null>((track, trigger) => {
    let $trapEl: HTMLElement | null = null
    return {
      get() {
        track()
        return $trapEl
      },
      set(value: HTMLElement | null) {
        $trapEl = value
        value ? initFocusTrap() : clearFocusTrap()
        trigger()
      },
    }
  })

  function keyHandler(e: KeyboardEvent) {
    const isTabPressed = e.key === "Tab"

    if (!isTabPressed) return

    if (e.shiftKey) {
      if (document.activeElement === $firstFocusable && $lastFocusable) {
        $lastFocusable.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === $lastFocusable && $firstFocusable) {
        $firstFocusable.focus()
        e.preventDefault()
      }
    }
  }

  function initFocusTrap() {
    if (!trapRef.value) return
    focusableElements = trapRef.value?.querySelectorAll(
      focusableElementsSelector
    ) as NodeListOf<HTMLElement>
    $firstFocusable = focusableElements[0] || null
    $lastFocusable = focusableElements[focusableElements.length - 1] || null
    document.addEventListener("keydown", keyHandler)
    $firstFocusable?.focus()
  }

  function clearFocusTrap() {
    document.removeEventListener("keydown", keyHandler)
  }

  return {
    trapRef,
    initFocusTrap,
    clearFocusTrap,
  }
}

export default useFocusTrap
