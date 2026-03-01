import { ProductRow } from './ProductRow'

/**
 * Products block: header, add button, list of product rows with catalog select and local price.
 */
export function ProductSelection({
  products = [],
  catalog = [],
  priceCurrency,
  exchangeRate,
  catalogLoading = false,
  catalogError = null,
  onAddProduct,
  onRemoveProduct,
  onSelectFromCatalog,
}) {
  return (
    <div className="products-block">
      <div className="products-header">
        <span>Products</span>
        <button type="button" onClick={onAddProduct} className="btn-secondary">
          + Product
        </button>
      </div>
      {catalogError && (
        <p className="error" role="alert">
          {catalogError}
        </p>
      )}
      {products.map((p, i) => (
        <ProductRow
          key={i}
          product={p}
          index={i}
          catalogOptions={catalog}
          priceCurrency={priceCurrency}
          exchangeRate={exchangeRate}
          onSelectFromCatalog={onSelectFromCatalog}
          onRemove={onRemoveProduct}
          canRemove={products.length > 1}
        />
      ))}
      {catalogLoading && catalog.length === 0 && (
        <p className="muted">Loading products…</p>
      )}
    </div>
  )
}
