import axios from 'axios'

// Use proxy in dev (same-origin, no CORS) unless VITE_API_URL is set for direct backend URL.
// Backend has CORS for http://localhost:5173 when using direct URL (see SecurityConfig).
const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

// When using proxy (/api), auth is added by Vite. When using direct URL, send Basic auth.
const isProxied = API_BASE === '/api'
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  ...(isProxied ? {} : { auth: { username: 'user', password: 'pass' } }),
})

export async function getPackages(includeVoided = false) {
  const { data } = await apiClient.get('/packages', {
    params: { includeVoided },
  })
  return data
}

export async function getPackage(id, includeVoided = false) {
  const { data } = await apiClient.get(`/packages/${id}`, {
    params: { includeVoided },
  })
  return data
}

export async function createPackage(payload) {
  const { data } = await apiClient.post('/packages', payload)
  return data
}

export async function updatePackage(id, payload) {
  const { data } = await apiClient.put(`/packages/${id}`, payload)
  return data
}

export async function deletePackage(id) {
  await apiClient.delete(`/packages/${id}`)
}

/**
 * Fetch USD-based exchange rates (base + rates map). Use for currency list and rates.
 * GET /exchange-rates/usd returns { base, date, rates: { EUR: 0.92, ... } }
 */
export async function getExchangeRatesUsd() {
  const { data } = await apiClient.get('/exchange-rates/usd')
  return data
}

/**
 * Fetch exchange rate for a single currency (e.g. for display).
 * GET /exchange-rates/{currency} returns the rate number.
 */
export async function getExchangeRate(currency) {
  const { data } = await apiClient.get(`/exchange-rates/${encodeURIComponent(currency)}`)
  return data
}

/**
 * Fetch all products from the backend (for package product selection).
 * GET /products returns [{ id, name, usdPrice, localPrice }, ...]
 */
export async function getProducts() {
  const { data } = await apiClient.get('/products')
  return data
}

/**
 * Fetch a single product by id.
 * GET /products/{id}
 */
export async function getProduct(id) {
  const { data } = await apiClient.get(`/products/${encodeURIComponent(id)}`)
  return data
}
