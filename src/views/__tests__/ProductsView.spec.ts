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
  it('shows list of products', async () => {
    const wrapper = mount(ProductsView)
    // @ts-expect-error products exists in ProductsView
    wrapper.vm.products = [
      {
        id: 1,
        title: 'Product A',
        category: 'A',
        price: 0,
      },
      {
        id: 2,
        title: 'Product B',
        category: 'B',
        price: 1,
      },
      {
        id: 3,
        title: 'Product C',
        category: 'C',
        price: 2,
      },
      {
        id: 4,
        title: 'Product D',
        category: 'D',
        price: 2,
      },
    ]
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.btn-product')).toHaveLength(4)
  })
  it('shows the correct amount of buttons in pagination', async () => {
    const wrapper = mount(ProductsView)
    // @ts-expect-error pageSize exists in ProductsView
    wrapper.vm.pageSize = 2
    // @ts-expect-error total exists in ProductsView
    wrapper.vm.total = 4
    // @ts-expect-error products exists in ProductsView
    wrapper.vm.products = [
      {
        id: 1,
        title: 'Product A',
        category: 'A',
        price: 0,
      },
    ]
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.btn')).toHaveLength(3)
  })
})
