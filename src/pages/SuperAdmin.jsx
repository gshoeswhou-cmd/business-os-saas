import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function SuperAdmin() {
  const { isPlatformOwner, signOut } = useAuth()
  const [businesses, setBusinesses] = useState([])
  const [message, setMessage] = useState('')

  async function loadBusinesses() {
    const { data, error } = await supabase
      .from('businesses')
      .select('id,business_name,business_model,status,email,phone,created_at')
      .order('created_at', { ascending: false })
    if (error) return setMessage(error.message)
    setBusinesses(data || [])
  }

  useEffect(() => {
    if (isPlatformOwner) loadBusinesses()
  }, [isPlatformOwner])

  async function updateStatus(id, status) {
    const { error } = await supabase.from('businesses').update({ status }).eq('id', id)
    if (error) return setMessage(error.message)
    await loadBusinesses()
  }

  if (!isPlatformOwner) {
    return (
      <main className="onboarding-page">
        <section className="onboarding-card narrow">
          <h1>Super admin only</h1>
          <p>Your account is not marked as platform owner yet.</p>
          <button className="btn ghost" onClick={signOut}>Logout</button>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div>
          <span className="brand-pill">Super Admin</span>
          <h1>Businesses</h1>
        </div>
        <div className="actions-row">
          <Link className="btn ghost" to="/dashboard">Dashboard</Link>
          <button className="btn ghost" onClick={signOut}>Logout</button>
        </div>
      </header>
      {message ? <p className="error-msg">{message}</p> : null}
      <section className="panel">
        <table>
          <thead>
            <tr><th>Business</th><th>Model</th><th>Status</th><th>Contact</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {businesses.map((business) => (
              <tr key={business.id}>
                <td>{business.business_name}</td>
                <td>{business.business_model}</td>
                <td><span className="status-pill">{business.status}</span></td>
                <td>{business.email}<br />{business.phone}</td>
                <td>
                  <button className="btn small" onClick={() => updateStatus(business.id, 'active')}>Approve</button>
                  <button className="btn small ghost" onClick={() => updateStatus(business.id, 'suspended')}>Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
