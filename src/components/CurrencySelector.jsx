/**
 * Currency dropdown and exchange rate display for package pricing.
 * Optionally shows total price (use PackagePriceDisplay for standalone total).
 */
export function CurrencySelector({
  priceCurrency,
  exchangeRate,
  onCurrencyChange,
  onExchangeRateChange,
  currencies = [],
  ratesData = null,
  loading = false,
  error = null,
}) {
  const isRateFromApi =
    ratesData &&
    (priceCurrency === ratesData?.base || (ratesData?.rates && priceCurrency in ratesData.rates))

  return (
    <>
      <label>
        Currency
        {loading ? (
          <span className="muted">Loading currencies…</span>
        ) : error ? (
          <span className="error">{error}</span>
        ) : currencies.length > 0 ? (
          <select
            value={priceCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            aria-label="Select currency"
          >
            {[...new Set([priceCurrency, ...currencies])].sort().map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        ) : (
          <input
            value={priceCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            placeholder="e.g. USD"
          />
        )}
      </label>
      <label>
        Exchange Rate
        <input
          type="number"
          step="0.0001"
          value={exchangeRate}
          onChange={(e) => onExchangeRateChange(Number(e.target.value) || 0)}
          readOnly={isRateFromApi}
          title={
            isRateFromApi ? 'Set by selected currency' : 'Editable when currency not from list'
          }
        />
      </label>
    </>
  )
}
