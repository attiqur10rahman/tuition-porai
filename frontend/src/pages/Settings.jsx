import { useEffect, useState } from 'react'
import { getProfile, updateProfile } from '../api'
import { Card, Btn, Field, PageHeader, Spinner, fmt } from '../components/ui'

export default function Settings() {
  const [form, setForm] = useState({ tutorName: '', tagline: '', phone: '', email: '', address: '', monthlyTarget: '', currency: '৳' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getProfile().then(r => {
      const d = r.data
      setForm({ tutorName: d.tutorName || '', tagline: d.tagline || '', phone: d.phone || '', email: d.email || '', address: d.address || '', monthlyTarget: d.monthlyTarget || '', currency: d.currency || '৳' })
    }).finally(() => setLoading(false))
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      await updateProfile({ ...form, monthlyTarget: parseFloat(form.monthlyTarget) || 0 })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) { alert('Error saving profile') }
    finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', maxWidth: 640 }}>
      <PageHeader title="Profile" subtitle="Manage your tuition profile and preferences" />

      {/* Profile card */}
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--accent-glow)', border: '2px solid var(--accent)', display: 'grid', placeItems: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>{form.tutorName || 'Tuition Porai'}</h2>
            <p style={{ color: 'var(--text3)', fontSize: '0.83rem' }}>{form.tagline || 'Tuition Management System'}</p>
          </div>
        </div>
        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, color: 'var(--text2)' }}>Tutor Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <Field label="Tuition Name" required>
            <input value={form.tutorName} onChange={e => set('tutorName', e.target.value)} placeholder="e.g. Tuition Porai" />
          </Field>
          <Field label="Tagline">
            <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="e.g. Best tutoring in town" />
          </Field>
          <Field label="Phone Number">
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="e.g. 01700000000" />
          </Field>
          <Field label="Email Address">
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="e.g. tutor@email.com" />
          </Field>
          <Field label="Address">
            <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="e.g. Narayanganj, Dhaka" style={{ gridColumn: '1/-1' }} />
          </Field>
        </div>
      </Card>

      {/* Financial settings */}
      <Card style={{ marginBottom: 18 }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, color: 'var(--text2)' }}>Financial Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <Field label="Monthly Income Target (৳)">
            <input type="number" value={form.monthlyTarget} onChange={e => set('monthlyTarget', e.target.value)} placeholder="e.g. 10000" />
          </Field>
          <Field label="Currency Symbol">
            <input value={form.currency} onChange={e => set('currency', e.target.value)} placeholder="৳" />
          </Field>
        </div>
        {form.monthlyTarget > 0 && (
          <p style={{ color: 'var(--text3)', fontSize: '0.82rem', marginTop: 10 }}>
            Monthly target: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{fmt(form.monthlyTarget)}</span> — visible on your dashboard
          </p>
        )}
      </Card>

      {/* Save button */}
      <Btn onClick={save} disabled={saving} style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
        {saved ? (
          <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Saved!</>
        ) : saving ? 'Saving...' : (
          <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save</>
        )}
      </Btn>

      {/* App info */}
      <Card style={{ marginTop: 24, background: 'transparent', border: '1px dashed var(--border)' }}>
        <p style={{ color: 'var(--text3)', fontSize: '0.8rem', textAlign: 'center' }}>
          <strong style={{ color: 'var(--text2)' }}>Tuition Porai</strong> · v1.0.0 · Built for Bangladeshi tutors
        </p>
      </Card>
    </div>
  )
}
