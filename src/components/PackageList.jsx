import { useState } from 'react'
import { usePackages } from '../context/PackagesContext'
import { PackageForm } from './PackageForm'

export function PackageList() {
  const { packages, loading, error, fetchPackages, deletePackage } = usePackages()
  const [showCreate, setShowCreate] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const handleCreateSuccess = () => {
    setShowCreate(false)
  }

  const handleEditSuccess = () => {
    setEditingPackage(null)
  }

  const handleEdit = (pkg) => {
    setShowCreate(false)
    setEditingPackage(pkg)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return
    setDeletingId(id)
    try {
      await deletePackage(id)
    } finally {
      setDeletingId(null)
    }
  }

  const handleCancelForm = () => {
    setShowCreate(false)
    setEditingPackage(null)
  }

  return (
    <section>
      <div className="list-header">
        <h2>Packages</h2>
        <div className="header-actions">
          <button
            type="button"
            onClick={() => fetchPackages()}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingPackage(null)
              setShowCreate(true)
            }}
            className="btn-primary"
          >
            Create package
          </button>
        </div>
      </div>
      {error && <p className="error">{error}</p>}

      {showCreate && (
        <div className="form-section">
          <PackageForm onSuccess={handleCreateSuccess} onCancel={handleCancelForm} />
        </div>
      )}

      {editingPackage && (
        <div className="form-section">
          <PackageForm
            package={editingPackage}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingPackage(null)}
          />
        </div>
      )}

      {loading && packages.length === 0 && <p>Loading packages…</p>}
      {!loading && !error && packages.length === 0 && !showCreate && (
        <p>No packages. Click &quot;Create package&quot; to add one.</p>
      )}
      {packages.length > 0 && (
        <ul className="package-list">
          {packages.map((pkg) => (
            <li key={pkg.packageId} className="package-card">
              <strong>{pkg.packageName}</strong>
              {pkg.packageDescription && (
                <p className="description">{pkg.packageDescription}</p>
              )}
              <p className="meta">
                {pkg.priceCurrency || 'USD'} {pkg.packagePrice != null && pkg.packagePrice.toFixed(2)}
                {pkg.products?.length != null && ` · ${pkg.products.length} product(s)`}
              </p>
              <div className="card-actions">
                <button
                  type="button"
                  onClick={() => handleEdit(pkg)}
                  className="btn-secondary"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(pkg.packageId)}
                  disabled={deletingId === pkg.packageId}
                  className="btn-danger"
                >
                  {deletingId === pkg.packageId ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
