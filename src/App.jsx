import { useEffect } from 'react'
import { PackagesProvider, usePackages } from './context/PackagesContext'
import { PackageList } from './components/PackageList'
import './App.css'

function AppContent() {
  const { fetchPackages } = usePackages()
  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  return (
    <div className="app">
      <header>
        <h1>Package Manager</h1>
        <p>List of packages from the backend API</p>
      </header>
      <main>
        <PackageList />
      </main>
    </div>
  )
}

function App() {
  return (
    <PackagesProvider>
      <AppContent />
    </PackagesProvider>
  )
}

export default App
