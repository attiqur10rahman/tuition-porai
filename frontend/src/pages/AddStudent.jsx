import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStudent, getBatches } from '../api'
import { Card, Btn, Field, PageHeader } from '../components/ui'

const STEPS = ['Basic Info', 'Schedule & Fee', 'Contact & Notes']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const CLASSES = ['Nursery','KG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12']

const INIT = { name: '', class: '', subject: '', batch: '', monthlyFee: '', schedule: [], joinDate: new Date().toISOString().slice(0,10), phone: '', whatsapp: '', notes: '' }

export default function AddStudent() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INIT)
  const [batches, setBatches] = useState([])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => { getBatches().then(r => setBatches(r.data)) }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleDay = (day) => {
    set('schedule', form.schedule.includes(day) ? form.schedule.filter(d => d !== day) : [...form.schedule, day])
  }

  const validate = () => {
    const e = {}
    if (step === 0) {
      if (!form.name.trim()) e.name = 'Name is required'
      if (!form.class) e.class = 'Class is required'
    }
    if (step === 1) {
      if (!form.monthlyFee || isNaN(form.monthlyFee)) e.monthlyFee = 'Enter a valid fee'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => s + 1) }
  const back = () => setStep(s => s - 1)

  const submit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { ...form, monthlyFee: parseFloat(form.monthlyFee), batch: form.batch || undefined }
      await createStudent(payload)
      navigate('/students')
    } catch (e) {
      alert(e.response?.data?.message || 'Error adding student')
    } finally { setSaving(false) }
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', maxWidth: 600 }}>
      <button onClick={() => navigate('/students')} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', marginBottom: 20 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>

      <PageHeader title="Add Student" subtitle="Register a new learner" />

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, alignItems: 'center' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center',
              fontWeight: 700, fontSize: '0.83rem', flexShrink: 0,
              background: i < step ? 'var(--green)' : i === step ? 'var(--accent)' : 'var(--card2)',
              color: i <= step ? 'white' : 'var(--text3)',
              boxShadow: i === step ? '0 0 14px var(--accent-glow)' : 'none',
              transition: 'all 0.3s'
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <div style={{ marginLeft: 8, marginRight: 8, display: i < STEPS.length - 1 ? 'none' : 'none' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: i === step ? 'var(--text)' : 'var(--text3)' }}>{s}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: '0 8px', background: i < step ? 'var(--green)' : 'var(--border)', transition: 'background 0.3s' }} />
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text3)', marginBottom: 18, marginTop: -10 }}>
        Step {step + 1} of {STEPS.length} — <span style={{ color: 'var(--text)' }}>{STEPS[step]}</span>
      </p>

      <Card>
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 0.3s ease' }}>
            <Field label="Full Name" required>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Rahul Ahmed" />
              {errors.name && <span style={{ color: 'var(--red)', fontSize: '0.78rem' }}>{errors.name}</span>}
            </Field>
            <Field label="Class" required>
              <select value={form.class} onChange={e => set('class', e.target.value)}>
                <option value="">Select class...</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.class && <span style={{ color: 'var(--red)', fontSize: '0.78rem' }}>{errors.class}</span>}
            </Field>
            <Field label="Subject">
              <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="e.g. Mathematics, Science, English" />
            </Field>
            <Field label="Join Date">
              <input type="date" value={form.joinDate} onChange={e => set('joinDate', e.target.value)} />
            </Field>
          </div>
        )}

        {/* Step 1: Schedule & Fee */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 0.3s ease' }}>
            <Field label="Monthly Fee (৳)" required>
              <input type="number" value={form.monthlyFee} onChange={e => set('monthlyFee', e.target.value)} placeholder="e.g. 1200" />
              {errors.monthlyFee && <span style={{ color: 'var(--red)', fontSize: '0.78rem' }}>{errors.monthlyFee}</span>}
            </Field>
            <Field label="Batch (optional)">
              <select value={form.batch} onChange={e => set('batch', e.target.value)}>
                <option value="">No batch</option>
                {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </Field>
            <Field label="Class Days">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
                {DAYS.map(d => (
                  <button key={d} type="button" onClick={() => toggleDay(d)} style={{
                    padding: '7px 14px', borderRadius: 8, border: '1px solid',
                    borderColor: form.schedule.includes(d) ? 'var(--accent)' : 'var(--border)',
                    background: form.schedule.includes(d) ? 'var(--accent-glow)' : 'transparent',
                    color: form.schedule.includes(d) ? 'var(--accent)' : 'var(--text2)',
                    fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s'
                  }}>{d}</button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 0.3s ease' }}>
            <Field label="Phone Number">
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="e.g. 01700000000" />
            </Field>
            <Field label="WhatsApp Number">
              <input type="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="e.g. 8801700000000" />
            </Field>
            <Field label="Additional Notes">
              <textarea rows={4} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any special notes about this student..." />
            </Field>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
          {step > 0 ? (
            <Btn variant="ghost" onClick={back}>← Back</Btn>
          ) : <div />}
          {step < STEPS.length - 1 ? (
            <Btn onClick={next}>Next →</Btn>
          ) : (
            <Btn onClick={submit} disabled={saving}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {saving ? 'Registering...' : 'Register Student'}
            </Btn>
          )}
        </div>
      </Card>
    </div>
  )
}
