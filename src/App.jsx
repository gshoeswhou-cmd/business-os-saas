import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Payment from './pages/Payment'
import PaymentPending from './pages/PaymentPending'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import Expenses from './pages/Expenses'
import Payments from './pages/Payments'
import Invoices from './pages/Invoices'
import Reports from './pages/Reports'
import Team from './pages/Team'
import Settings from './pages/Settings'
import SuperAdmin from './pages/SuperAdmin'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="center-screen">Loading workspace…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function DashboardGate({ children }) {
  const { activeBusiness, loading } = useAuth()
  if (loading) return <div className="center-screen">Loading business…</div>
  if (!activeBusiness) return <Navigate to="/onboarding" replace />
  if (activeBusiness.status === 'pending_payment') return <Navigate to="/payment-pending" replace />
  if (activeBusiness.status !== 'active') return <Navigate to="/payment-pending" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/payment-pending" element={<ProtectedRoute><PaymentPending /></ProtectedRoute>} />

      <Route path="/" element={<ProtectedRoute><DashboardGate><DashboardLayout /></DashboardGate></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="payments" element={<Payments />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="reports" element={<Reports />} />
        <Route path="team" element={<Team />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/super-admin" element={<ProtectedRoute><SuperAdmin /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
