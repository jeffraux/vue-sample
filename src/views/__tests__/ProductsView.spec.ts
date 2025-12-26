import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import ProductsView from '../ProductsView.vue'

describe('Products Page', () => {
  it('renders properly', () => {
    const wrapper = mount(ProductsView)
    expect(wrapper.text()).toContain('Products')
  })
  it('shows a search field', async () => {
    const wrapper = mount(ProductsView)
    expect(wrapper.findAll('input')[0]?.text()).toBe('')
  })
  it('shows an empty page', async () => {
    const wrapper = mount(ProductsView)
    expect(wrapper.text()).toContain('No products available.')
  })
})
