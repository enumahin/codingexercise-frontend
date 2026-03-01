/**
 * Read-only display of total package price in the selected currency.
 */
export function PackagePriceDisplay({ totalPrice, currency = 'USD' }) {
  return (
    <label>
      Price ({currency})
      <input
        type="number"
        step="0.01"
        readOnly
        value={typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00'}
        aria-label="Total price (sum of product local prices)"
      />
    </label>
  )
}
