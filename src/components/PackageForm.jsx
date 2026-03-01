import { useState, useEffect } from 'react'
import { usePackages } from '../context/PackagesContext'
import { getExchangeRatesUsd, getProducts } from '../api/client'
import { PackageDetailsForm } from './PackageDetailsForm'
import { CurrencySelector } from './CurrencySelector'
import { PackagePriceDisplay } from './PackagePriceDisplay'
import { ProductSelection } from './ProductSelection'

export const emptyProduct = () => ({
  productId: '',
  productName: '',
  productDescription: '',
  usdPrice: 0,
})

/** Build sorted list of currency codes from exchange-rates/usd response (base + rates keys). */
function currenciesFromRates(data) {
  if (!data) return []
  const base = data.base ? [data.base] : []
  const codes = data.rates ? Object.keys(data.rates) : []
  return [...new Set([...base, ...codes])].sort()
}

export function PackageForm({ package: editPackage, onSuccess, onCancel }) {
  const { createPackage, updatePackage, error, clearError } = usePackages()
  const isEdit = Boolean(editPackage?.packageId)

  const [packageName, setPackageName] = useState('')
  const [packageDescription, setPackageDescription] = useState('')
  const [priceCurrency, setPriceCurrency] = useState('USD')
  const [exchangeRate, setExchangeRate] = useState(1)
  const [products, setProducts] = useState([emptyProduct()])
  const [submitting, setSubmitting] = useState(false)

  const [currencies, setCurrencies] = useState([])
  const [ratesData, setRatesData] = useState(null)
  const [currenciesLoading, setCurrenciesLoading] = useState(true)
  const [currenciesError, setCurrenciesError] = useState(null)

  const [productsCatalog, setProductsCatalog] = useState([])
  const [productsCatalogLoading, setProductsCatalogLoading] = useState(true)
  const [productsCatalogError, setProductsCatalogError] = useState(null)
  const [validationError, setValidationError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setCurrenciesLoading(true)
    setCurrenciesError(null)
    getExchangeRatesUsd()
      .then((data) => {
        if (cancelled) return
        setRatesData(data)
        setCurrencies(currenciesFromRates(data))
      })
      .catch((e) => {
        if (cancelled) return
        setCurrenciesError(e.response?.data?.message || e.message || 'Failed to load currencies')
        setCurrencies([])
      })
      .finally(() => {
        if (!cancelled) setCurrenciesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setProductsCatalogLoading(true)
    setProductsCatalogError(null)
    getProducts()
      .then((list) => {
        if (cancelled) return
        setProductsCatalog(Array.isArray(list) ? list : [])
      })
      .catch((e) => {
        if (cancelled) return
        setProductsCatalogError(e.response?.data?.message || e.message || 'Failed to load products')
        setProductsCatalog([])
      })
      .finally(() => {
        if (!cancelled) setProductsCatalogLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (editPackage) {
      setPackageName(editPackage.packageName || '')
      setPackageDescription(editPackage.packageDescription || '')
      setPriceCurrency(editPackage.priceCurrency || 'USD')
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

  const handleCurrencyChange = (currency) => {
    setPriceCurrency(currency)
    if (ratesData?.rates && currency in ratesData.rates) {
      setExchangeRate(ratesData.rates[currency])
    } else if (ratesData?.base === currency) {
      setExchangeRate(1)
    }
  }

  const addProduct = () => {
    setProducts((prev) => [...prev, emptyProduct()])
  }

  const selectProductFromCatalog = (index, product) => {
    if (!product?.id) return
    setProducts((prev) => {
      const next = [...prev]
      next[index] = {
        productId: product.id,
        productName: product.name ?? '',
        productDescription: next[index]?.productDescription ?? '',
        usdPrice: Number(product.usdPrice) ?? 0,
      }
      return next
    })
  }

  const rate = Number(exchangeRate) || 1
  const totalPackagePrice = products.reduce(
    (sum, p) => sum + rate * (Number(p.usdPrice) || 0),
    0
  )

  const catalogIds = new Set((productsCatalog || []).map((c) => c.id))
  const allProductsValid =
    !productsCatalogLoading &&
    productsCatalog.length > 0 &&
    products.length > 0 &&
    products.every((p) => p.productId && catalogIds.has(p.productId))
  const canSubmit = allProductsValid

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setValidationError(null)
    if (!canSubmit) {
      setValidationError(
        'Every product must be selected from the product list. Please choose a valid product from the dropdown for each row.'
      )
      return
    }

    setSubmitting(true)
    const selectedProducts = products.filter((p) => p.productId && catalogIds.has(p.productId))
    const payload = {
      packageName,
      packageDescription,
      priceCurrency,
      packagePrice: totalPackagePrice,
      exchangeRate: Number(exchangeRate) || 1,
      products: selectedProducts.map((p) => {
        const usd = Number(p.usdPrice) || 0
        const r = Number(exchangeRate) || 1
        return {
          productId: p.productId,
          productName: p.productName,
          productDescription: p.productDescription || '',
          usdPrice: usd,
          localPrice: r * usd,
        }
      }),
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
      {validationError && <p className="error" role="alert">{validationError}</p>}
      {!productsCatalogLoading && products.length > 0 && !allProductsValid && !validationError && (
        <p className="error" role="alert">
          All products must be selected from the product list. Please choose a product from the
          dropdown for each row.
        </p>
      )}

      <PackageDetailsForm
        packageName={packageName}
        packageDescription={packageDescription}
        onNameChange={setPackageName}
        onDescriptionChange={setPackageDescription}
      />

      <div className="form-row">
        <CurrencySelector
          priceCurrency={priceCurrency}
          exchangeRate={exchangeRate}
          onCurrencyChange={handleCurrencyChange}
          onExchangeRateChange={setExchangeRate}
          currencies={currencies}
          ratesData={ratesData}
          loading={currenciesLoading}
          error={currenciesError}
        />
        <PackagePriceDisplay totalPrice={totalPackagePrice} currency={priceCurrency} />
      </div>

      <ProductSelection
        products={products}
        catalog={productsCatalog}
        priceCurrency={priceCurrency}
        exchangeRate={exchangeRate}
        catalogLoading={productsCatalogLoading}
        catalogError={productsCatalogError}
        onAddProduct={addProduct}
        onSelectFromCatalog={selectProductFromCatalog}
      />

      <div className="form-actions">
        <button type="submit" disabled={submitting || !canSubmit}>
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
