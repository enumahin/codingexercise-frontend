/**
 * Single product row: catalog select, local price display, remove button.
 */
export function ProductRow({
  product,
  index,
  catalogOptions = [],
  priceCurrency,
  exchangeRate,
  onSelectFromCatalog,
  onRemove,
  canRemove = true,
}) {
  const currentInCatalog = catalogOptions.some((c) => c.id === product.productId)
  const options =
    currentInCatalog || !product.productId
      ? catalogOptions
      : [
          {
            id: product.productId,
            name: product.productName || product.productId,
            usdPrice: product.usdPrice,
          },
          ...catalogOptions,
        ]
  const localPrice = ((Number(exchangeRate) || 1) * (Number(product.usdPrice) || 0)).toFixed(2)

  return (
    <div className="product-row">
      {catalogOptions.length > 0 && (
        <label className="product-select-label">
          Product
          <select
            className="form-control"
            value={product.productId || ''}
            onChange={(e) => {
              const id = e.target.value
              if (id) {
                const selected = options.find((c) => c.id === id)
                if (selected) onSelectFromCatalog(index, selected)
              }
            }}
            aria-label="Select product from catalog"
          >
            <option value="">Select a product…</option>
            {options.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <label>
        Price ({priceCurrency})
        <input
          type="number"
          step="0.01"
          readOnly
          value={localPrice}
          aria-label="Local price (exchange rate × USD price)"
        />
      </label>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="btn-danger"
        disabled={!canRemove}
      >
        Remove
      </button>
    </div>
  )
}
