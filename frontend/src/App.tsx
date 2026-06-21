import { Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import AdminLayout from './components/layout/AdminLayout'
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
import UserLayout from './components/layout/UserLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="produits" element={<Produits />} />
        <Route path="commandes" element={<CommandesAdmin />} />
        <Route path="factures" element={<FacturesAdmin />} />
        <Route path="utilisateurs" element={<Utilisateurs />} />
      </Route>

        <Route
          path="/user"
          element={<PrivateRoute role="user"><UserLayout /></PrivateRoute>}
        >
          <Route index element={<Navigate to="/user/catalogue" replace />} />
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="produit/:id" element={<Produit />} />
          <Route path="panier" element={<Panier />} />
          <Route path="commandes" element={<CommandesUser />} />
          <Route path="factures" element={<FacturesUser />} />
        </Route>
    </Routes>
  )
}

export default App
