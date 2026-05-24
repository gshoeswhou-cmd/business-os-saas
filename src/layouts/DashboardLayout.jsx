import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  ['Dashboard', '/dashboard'],
  ['Orders', '/orders'],
  ['Products', '/products'],
  ['Inventory', '/inventory'],
  ['Expenses', '/expenses'],
  ['Payments', '/payments'],
  ['Invoices', '/invoices'],
  ['Reports', '/reports'],
  ['Team', '/team'],
  ['Settings', '/settings'],
]

export default function DashboardLayout() {
  const { activeBusiness, user, signOut } = useAuth()
  const labels = activeBusiness?.settings?.labels || {}

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-box">BOS</div>
          <h2>{activeBusiness?.business_name || 'Business OS'}</h2>
          <p>{activeBusiness?.status}</p>
        </div>
        <nav>
          {navItems.map(([label, href]) => (
            <NavLink key={href} to={href} className={({ isActive }) => (isActive ? 'active' : '')}>
              {labels[label.toLowerCase()] || label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div>
            <strong>{activeBusiness?.business_name}</strong>
            <span>{user?.email}</span>
          </div>
          <button className="btn ghost" onClick={signOut}>Logout</button>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  )
}
