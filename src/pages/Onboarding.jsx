import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, reloadProfile } = useAuth()
  const [templates, setTemplates] = useState([])
  const [form, setForm] = useState({
    business_name: '',
    business_model: 'product_based',
    template_key: '',
    owner_name: '',
    phone: '',
    email: user?.email || '',
    address: '',
    brand_color: '#7c5cff',
    gcash_name: '',
    gcash_number: '',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadTemplates() {
      const { data, error } = await supabase
        .from('business_templates')
        .select('template_key, template_name, business_model, description')
        .order('template_name')
      if (error) return setMessage(error.message)
      setTemplates(data || [])
      if (data?.[0]) setForm((prev) => ({ ...prev, template_key: data[0].template_key }))
    }
    loadTemplates()
  }, [])

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { data, error } = await supabase.rpc('create_business_workspace', {
      p_business_name: form.business_name,
      p_business_model: form.business_model,
      p_template_key: form.template_key,
      p_owner_name: form.owner_name,
      p_phone: form.phone || null,
      p_email: form.email || null,
      p_address: form.address || null,
      p_logo_url: null,
      p_brand_color: form.brand_color,
      p_gcash_name: form.gcash_name || null,
      p_gcash_number: form.gcash_number || null,
    })
    setLoading(false)
    if (error) return setMessage(error.message)
    await reloadProfile()
    navigate(`/payment?business_id=${data}`)
  }

  return (
    <main className="onboarding-page">
      <form onSubmit={handleSubmit} className="onboarding-card">
        <div>
          <span className="brand-pill">Setup</span>
          <h1>Create your business workspace</h1>
          <p>Choose your business model and template. All features are included; the template only changes the labels, statuses, and default categories.</p>
        </div>

        <div className="grid-2">
          <div>
            <label>Business name</label>
            <input value={form.business_name} onChange={(e) => update('business_name', e.target.value)} required />
          </div>
          <div>
            <label>Owner name</label>
            <input value={form.owner_name} onChange={(e) => update('owner_name', e.target.value)} required />
          </div>
          <div>
            <label>Business model</label>
            <select value={form.business_model} onChange={(e) => update('business_model', e.target.value)}>
              <option value="product_based">Product-Based</option>
              <option value="service_based">Service-Based</option>
              <option value="both">Both Product + Service</option>
            </select>
          </div>
          <div>
            <label>Business template</label>
            <select value={form.template_key} onChange={(e) => update('template_key', e.target.value)} required>
              {templates.map((template) => (
                <option key={template.template_key} value={template.template_key}>{template.template_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Email</label>
            <input value={form.email} onChange={(e) => update('email', e.target.value)} type="email" />
          </div>
          <div>
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div>
            <label>GCash name</label>
            <input value={form.gcash_name} onChange={(e) => update('gcash_name', e.target.value)} />
          </div>
          <div>
            <label>GCash number</label>
            <input value={form.gcash_number} onChange={(e) => update('gcash_number', e.target.value)} />
          </div>
          <div>
            <label>Brand color</label>
            <input value={form.brand_color} onChange={(e) => update('brand_color', e.target.value)} type="color" />
          </div>
          <div>
            <label>Address</label>
            <input value={form.address} onChange={(e) => update('address', e.target.value)} />
          </div>
        </div>
        {message ? <p className="error-msg">{message}</p> : null}
        <button className="btn primary" disabled={loading}>{loading ? 'Creating workspace…' : 'Continue to payment'}</button>
      </form>
    </main>
  )
}
