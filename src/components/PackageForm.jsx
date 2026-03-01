import { useState, useEffect } from 'react'
import { usePackages } from '../context/PackagesContext'

const emptyProduct = () => ({
  productId: '',
  productName: '',
  productDescription: '',
  usdPrice: 0,
})

export function PackageForm({ package: editPackage, onSuccess, onCancel }) {
  const { createPackage, updatePackage, error, clearError } = usePackages()
  const isEdit = Boolean(editPackage?.packageId)

  const [packageName, setPackageName] = useState('')
  const [packageDescription, setPackageDescription] = useState('')
  const [priceCurrency, setPriceCurrency] = useState('USD')
  const [packagePrice, setPackagePrice] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(1)
  const [products, setProducts] = useState([emptyProduct()])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (editPackage) {
      setPackageName(editPackage.packageName || '')
      setPackageDescription(editPackage.packageDescription || '')
      setPriceCurrency(editPackage.priceCurrency || 'USD')
      setPackagePrice(editPackage.packagePrice ?? 0)
      setExchangeRate(editPackage.exchangeRate ?? 1)
      const prods = editPackage.products?.length
        ? editPackage.products.map((p) => ({
            productId: p.productId ?? p.id ?? '',
            productName: p.productName ?? '',
            productDescription: p.productDescription ?? '',
            usdPrice: p.usdPrice ?? 0,
          }))
        : [emptyProduct()]
      setProducts(prods)
    }
  }, [editPackage])

  const addProduct = () => {
    setProducts((prev) => [...prev, emptyProduct()])
  }

  const removeProduct = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index))
  }

  const updateProduct = (index, field, value) => {
    setProducts((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setSubmitting(true)
    const payload = {
      packageName,
      packageDescription,
      priceCurrency,
      packagePrice: Number(packagePrice) || 0,
      exchangeRate: Number(exchangeRate) || 1,
      products: products
        .filter((p) => p.productId || p.productName)
        .map((p) => ({
          productId: p.productId,
          productName: p.productName,
          productDescription: p.productDescription || '',
          usdPrice: Number(p.usdPrice) || 0,
        })),
    }
    if (payload.products.length === 0) {
      payload.products = [{ productId: '1', productName: 'Placeholder', productDescription: '', usdPrice: 0 }]
    }
    try {
      if (isEdit) {
        await updatePackage(editPackage.packageId, payload)
      } else {
        await createPackage(payload)
      }
      onSuccess?.()
    } catch {
      // error already set in context
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="package-form" onSubmit={handleSubmit}>
      <h3>{isEdit ? 'Edit package' : 'New package'}</h3>
      {error && <p className="error">{error}</p>}
      <label>
        Name *
        <input
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          required
        />
      </label>
      <label>
        Description
        <input
          value={packageDescription}
          onChange={(e) => setPackageDescription(e.target.value)}
        />
      </label>
      <div className="form-row">
        <label>
          Currency
          <input
            value={priceCurrency}
            onChange={(e) => setPriceCurrency(e.target.value)}
          />
        </label>
        <label>
          Price
          <input
            type="number"
            step="0.01"
            value={packagePrice}
            onChange={(e) => setPackagePrice(e.target.value)}
          />
        </label>
        <label>
          Exchange rate
          <input
            type="number"
            step="0.0001"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
          />
        </label>
      </div>
      <div className="products-block">
        <div className="products-header">
          <span>Products</span>
          <button type="button" onClick={addProduct} className="btn-secondary">
            + Product
          </button>
        </div>
        {products.map((p, i) => (
          <div key={i} className="product-row">
            <input
              placeholder="Product ID"
              value={p.productId}
              onChange={(e) => updateProduct(i, 'productId', e.target.value)}
            />
            <input
              placeholder="Name"
              value={p.productName}
              onChange={(e) => updateProduct(i, 'productName', e.target.value)}
            />
            <input
              placeholder="Description"
              value={p.productDescription}
              onChange={(e) => updateProduct(i, 'productDescription', e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="USD price"
              value={p.usdPrice}
              onChange={(e) => updateProduct(i, 'usdPrice', e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeProduct(i)}
              className="btn-danger"
              disabled={products.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
