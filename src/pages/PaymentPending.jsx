import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PaymentPending() {
  const { activeBusiness, signOut } = useAuth()
  return (
    <main className="onboarding-page">
      <section className="onboarding-card narrow">
        <span className="brand-pill">Pending Approval</span>
        <h1>Your dashboard is waiting for approval.</h1>
        <p>Business: <strong>{activeBusiness?.business_name || 'Your business'}</strong></p>
        <p>After payment is verified by the platform owner, your dashboard will unlock automatically.</p>
        <div className="actions-row">
          <Link className="btn primary" to="/dashboard">Check again</Link>
          <button className="btn ghost" onClick={signOut}>Logout</button>
        </div>
      </section>
    </main>
  )
}
