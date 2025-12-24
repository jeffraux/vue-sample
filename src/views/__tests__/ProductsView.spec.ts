import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ProductsView from '../ProductsView.vue'

describe('Products Page', () => {
  it('renders properly', () => {
    const wrapper = mount(ProductsView, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
