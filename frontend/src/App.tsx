import { Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Login from './features/auth/Login'
import Dashboard from './pages/admin/Dashboard'
import Produits from './pages/admin/Produits'
import CommandesAdmin from './pages/admin/Commandes'
import FacturesAdmin from './pages/admin/Factures'
import Utilisateurs from './pages/admin/Utilisateurs'
import Catalogue from './pages/user/Catalogue'
import Produit from './pages/user/Produit'
import Panier from './pages/user/Panier'
import CommandesUser from './pages/user/Commandes'
import FacturesUser from './pages/user/Factures'
import Unauthorized from './pages/Unauthorized'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute role="admin">
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/produits"
        element={
          <PrivateRoute role="admin">
            <Produits />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/commandes"
        element={
          <PrivateRoute role="admin">
            <CommandesAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/factures"
        element={
          <PrivateRoute role="admin">
            <FacturesAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/utilisateurs"
        element={
          <PrivateRoute role="admin">
            <Utilisateurs />
          </PrivateRoute>
        }
      />

      <Route
        path="/user/catalogue"
        element={
          <PrivateRoute role="user">
            <Catalogue />
          </PrivateRoute>
        }
      />
      <Route
        path="/user/produit/:id"
        element={
          <PrivateRoute role="user">
            <Produit />
          </PrivateRoute>
        }
      />
      <Route
        path="/user/panier"
        element={
          <PrivateRoute role="user">
            <Panier />
          </PrivateRoute>
        }
      />
      <Route
        path="/user/commandes"
        element={
          <PrivateRoute role="user">
            <CommandesUser />
          </PrivateRoute>
        }
      />
      <Route
        path="/user/factures"
        element={
          <PrivateRoute role="user">
            <FacturesUser />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
