import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PackagePriceDisplay } from './PackagePriceDisplay'

describe('PackagePriceDisplay', () => {
  it('renders price label with currency and formats total price to two decimals', () => {
    render(<PackagePriceDisplay totalPrice={12.5} currency="EUR" />)
    expect(screen.getByLabelText(/total price/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('12.50')).toBeInTheDocument()
    expect(screen.getByText(/Price \(EUR\)/)).toBeInTheDocument()
  })

  it('displays 0.00 when totalPrice is not a number', () => {
    render(<PackagePriceDisplay totalPrice={undefined} currency="USD" />)
    expect(screen.getByDisplayValue('0.00')).toBeInTheDocument()
  })

  it('defaults currency to USD when not provided', () => {
    render(<PackagePriceDisplay totalPrice={0} />)
    expect(screen.getByText(/Price \(USD\)/)).toBeInTheDocument()
  })
})
