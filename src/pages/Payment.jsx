import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Payment() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const businessId = params.get('business_id')
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState('')
  const [proof, setProof] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function uploadProof(file) {
    if (!file) return null
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${businessId}/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('payment-proofs').upload(path, file)
    if (error) throw error
    return supabase.storage.from('payment-proofs').getPublicUrl(path).data.publicUrl
  }

  async function submitPayment(e) {
    e.preventDefault()
    if (!businessId) return setMessage('Missing business ID.')
    setLoading(true)
    setMessage('')
    try {
      const proofUrl = await uploadProof(proof)
      const { error } = await supabase.from('platform_payments').insert({
        business_id: businessId,
        plan_name: 'starter',
        amount: Number(amount || 0),
        payment_method: 'GCash',
        reference_number: reference,
        proof_url: proofUrl,
        status: 'pending',
      })
      if (error) throw error
      navigate('/payment-pending')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="onboarding-page">
      <form onSubmit={submitPayment} className="onboarding-card narrow">
        <span className="brand-pill">Payment</span>
        <h1>Upload proof of payment</h1>
        <p>Your workspace was created. Upload payment proof so the platform owner can approve your dashboard access.</p>
        <div className="payment-box">
          <strong>Manual GCash Payment</strong>
          <p>Add your QR/GCash details on the public sales page later. This MVP records the proof and keeps the business pending until approved.</p>
        </div>
        <label>Amount paid</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="0" step="0.01" required />
        <label>Reference number</label>
        <input value={reference} onChange={(e) => setReference(e.target.value)} required />
        <label>Payment proof</label>
        <input onChange={(e) => setProof(e.target.files?.[0] || null)} type="file" accept="image/*,application/pdf" required />
        {message ? <p className="error-msg">{message}</p> : null}
        <button className="btn primary" disabled={loading}>{loading ? 'Submitting…' : 'Submit payment proof'}</button>
      </form>
    </main>
  )
}
