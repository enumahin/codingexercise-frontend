import { createContext, useContext, useState, useCallback } from 'react'
import * as api from '../api/client'

const PackagesContext = createContext(null)

export function PackagesProvider({ children }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const clearError = useCallback(() => setError(null), [])

  const fetchPackages = useCallback(async (includeVoided = false) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getPackages(includeVoided)
      setPackages(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load packages')
      setPackages([])
    } finally {
      setLoading(false)
    }
  }, [])

  const getPackage = useCallback(async (id, includeVoided = false) => {
    setError(null)
    try {
      return await api.getPackage(id, includeVoided)
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load package')
      return null
    }
  }, [])

  const createPackage = useCallback(async (payload) => {
    setError(null)
    try {
      const created = await api.createPackage(payload)
      setPackages((prev) => [...prev, created])
      return created
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to create package'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const updatePackage = useCallback(async (id, payload) => {
    setError(null)
    try {
      const updated = await api.updatePackage(id, payload)
      setPackages((prev) => prev.map((p) => (p.packageId === id ? updated : p)))
      return updated
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to update package'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const deletePackage = useCallback(async (id) => {
    setError(null)
    try {
      await api.deletePackage(id)
      setPackages((prev) => prev.filter((p) => p.packageId !== id))
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to delete package'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const value = {
    packages,
    loading,
    error,
    clearError,
    fetchPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage,
  }

  return (
    <PackagesContext.Provider value={value}>
      {children}
    </PackagesContext.Provider>
  )
}

export function usePackages() {
  const ctx = useContext(PackagesContext)
  if (!ctx) throw new Error('usePackages must be used within PackagesProvider')
  return ctx
}
