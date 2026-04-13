import { useEffect, useState } from 'react'
import { getBatches, createBatch, updateBatch, deleteBatch } from '../api'
import { Card, Btn, Badge, PageHeader, Field, Spinner, Empty, avatarColor } from '../components/ui'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const INIT = { name: '', subject: '', schedule: [], time: '', description: '' }

export default function Batches() {
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(INIT)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    getBatches().then(r => setBatches(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleDay = (d) => set('schedule', form.schedule.includes(d) ? form.schedule.filter(x => x !== d) : [...form.schedule, d])

  const openAdd = () => { setForm(INIT); setEditing(null); setShowForm(true) }
  const openEdit = (b) => { setForm({ name: b.name, subject: b.subject || '', schedule: b.schedule || [], time: b.time || '', description: b.description || '' }); setEditing(b._id); setShowForm(true) }

  const save = async () => {
    if (!form.name.trim()) return alert('Batch name is required')
    setSaving(true)
    try {
      if (editing) await updateBatch(editing, form)
      else await createBatch(form)
      setShowForm(false); setEditing(null); setForm(INIT)
      load()
    } catch (e) { alert(e.response?.data?.message || 'Error saving batch') }
    finally { setSaving(false) }
  }

  const remove = async (id, name) => {
    if (!confirm(`Delete batch "${name}"? Students will be unassigned.`)) return
    await deleteBatch(id); load()
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <PageHeader title="Batches" subtitle="Manage student groups"
        action={<Btn onClick={openAdd}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          New Batch
        </Btn>}
      />

      {/* Form */}
      {showForm && (
        <Card style={{ marginBottom: 20, border: '1px solid var(--accent)', animation: 'fadeUp 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>{editing ? 'Edit Batch' : 'New Batch'}</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Batch Name" required>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Morning Batch A" />
            </Field>
            <Field label="Subject">
              <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="e.g. Mathematics" />
            </Field>
            <Field label="Class Time">
              <input value={form.time} onChange={e => set('time', e.target.value)} placeholder="e.g. 8:00 AM - 9:30 AM" />
            </Field>
            <Field label="Schedule Days">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 2 }}>
                {DAYS.map(d => (
                  <button key={d} type="button" onClick={() => toggleDay(d)} style={{
                    padding: '6px 12px', borderRadius: 7, border: '1px solid',
                    borderColor: form.schedule.includes(d) ? 'var(--accent)' : 'var(--border)',
                    background: form.schedule.includes(d) ? 'var(--accent-glow)' : 'transparent',
                    color: form.schedule.includes(d) ? 'var(--accent)' : 'var(--text2)',
                    fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer'
                  }}>{d}</button>
                ))}
              </div>
            </Field>
            <Field label="Description" >
              <input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional description..." style={{ gridColumn: '1/-1' }} />
            </Field>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn onClick={save} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Batch' : 'Create Batch'}</Btn>
          </div>
        </Card>
      )}

      {loading ? <Spinner /> : batches.length === 0 ? (
        <Empty icon="📚" message="No batches yet. Create your first group!"
          action={<Btn onClick={openAdd}>Create Batch</Btn>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {batches.map((b, i) => {
            const col = avatarColor(b.name)
            return (
              <Card key={b._id} style={{ border: `1px solid ${col}33`, animation: `fadeUp 0.3s ease ${i * 0.06}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: col + '22', display: 'grid', placeItems: 'center', color: col, fontSize: '1.1rem' }}>
                    📚
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(b)} style={{ background: 'var(--accent-glow)', border: 'none', color: 'var(--accent)', width: 30, height: 30, borderRadius: 7, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => remove(b._id, b.name)} style={{ background: 'var(--red-bg)', border: 'none', color: 'var(--red)', width: 30, height: 30, borderRadius: 7, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
                <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{b.name}</h3>
                {b.subject && <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 8 }}>{b.subject}</p>}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {b.schedule?.map(d => <Badge key={d} color="muted">{d}</Badge>)}
                  {b.time && <Badge color="accent">{b.time}</Badge>}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{b.studentCount} student{b.studentCount !== 1 ? 's' : ''}</span>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
