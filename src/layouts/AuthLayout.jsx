import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand-pill">Business OS</div>
        <h1>One dashboard for sales, inventory, expenses, invoices, and profit.</h1>
        <p>Built for Filipino small business owners, resellers, food sellers, service providers, and local stores.</p>
      </section>
      <section className="auth-card">
        <Outlet />
        <p className="small-center">
          <Link to="/login">Login</Link> · <Link to="/signup">Create account</Link>
        </p>
      </section>
    </main>
  )
}
