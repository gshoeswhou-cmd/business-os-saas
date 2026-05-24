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

function SystemNotice() {
  const { authError, isSupabaseConfigured } = useAuth()
  if (!authError && isSupabaseConfigured) return null
  return (
    <div className="system-notice">
      <strong>Setup issue:</strong> {authError || 'Supabase is not configured yet.'}
      <br />
      Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify, then clear cache and redeploy.
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading, authError } = useAuth()
  if (loading) return <div className="center-screen">Loading workspace…</div>
  if (authError) return <><SystemNotice /><AuthLayout /></>
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
    <>
      <SystemNotice />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/payment-pending" element={<ProtectedRoute><PaymentPending /></ProtectedRoute>} />

        <Route path="/app" element={<ProtectedRoute><DashboardGate><DashboardLayout /></DashboardGate></ProtectedRoute>}>
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

        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/orders" element={<Navigate to="/app/orders" replace />} />
        <Route path="/products" element={<Navigate to="/app/products" replace />} />
        <Route path="/inventory" element={<Navigate to="/app/inventory" replace />} />
        <Route path="/expenses" element={<Navigate to="/app/expenses" replace />} />
        <Route path="/payments" element={<Navigate to="/app/payments" replace />} />
        <Route path="/invoices" element={<Navigate to="/app/invoices" replace />} />
        <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
        <Route path="/team" element={<Navigate to="/app/team" replace />} />
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

        <Route path="/super-admin" element={<ProtectedRoute><SuperAdmin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}
