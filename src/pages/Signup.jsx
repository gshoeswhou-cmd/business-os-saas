import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) return setMessage(error.message)
    navigate('/onboarding')
  }

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2>Create account</h2>
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      <label>Password</label>
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={6} required />
      {message ? <p className="error-msg">{message}</p> : null}
      <button className="btn primary" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
    </form>
  )
}
