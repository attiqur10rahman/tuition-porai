import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getStudent, recordPayment, deletePayment, getBatches } from '../api'
import { Card, Badge, Avatar, Btn, Spinner, Field, fmt, avatarColor, MONTHS } from '../components/ui'

const now = new Date()

export default function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [batches, setBatches] = useState([])
  const [form, setForm] = useState({ amount: '', month: now.getMonth() + 1, year: now.getFullYear(), note: '', type: 'regular' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([getStudent(id), getBatches()]).then(([s, b]) => {
      setStudent(s.data)
      setBatches(b.data)
      setForm(f => ({ ...f, amount: s.data.monthlyFee || '' }))
    }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [id])

  const handlePay = async () => {
    if (!form.amount) return alert('Enter an amount')
    setSaving(true)
    try {
      await recordPayment({ studentId: id, ...form, amount: parseFloat(form.amount) })
      setForm(f => ({ ...f, amount: student.monthlyFee, note: '' }))
      load()
    } catch (e) {
      alert(e.response?.data?.message || 'Error recording payment')
    } finally { setSaving(false) }
  }

  const handleDeletePayment = async (pid) => {
    if (!confirm('Delete this payment?')) return
    await deletePayment(pid)
    load()
  }

  if (loading) return <Spinner />
  if (!student) return <p style={{ color: 'var(--text3)' }}>Student not found.</p>

  const color = avatarColor(student.name)

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', maxWidth: 820 }}>
      {/* Back */}
      <button onClick={() => navigate('/students')} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', marginBottom: 20 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Students
      </button>

      {/* Profile hero */}
      <Card style={{ marginBottom: 18, background: `linear-gradient(135deg, ${color}18 0%, var(--card) 100%)`, border: `1px solid ${color}33` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
          <Avatar name={student.name} color={color} size={60} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 800 }}>{student.name}</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
              <Badge color="accent">Class {student.class}</Badge>
              {student.batch?.name && <Badge color="muted">{student.batch.name}</Badge>}
              {student.subject && <Badge color="muted">{student.subject}</Badge>}
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
              <Info icon="📅" text={new Date(student.joinDate).toLocaleDateString()} label="Joined" />
              <Info icon="💰" text={fmt(student.monthlyFee) + '/mo'} label="Monthly Fee" />
              {student.schedule?.length > 0 && <Info icon="🗓️" text={student.schedule.join(', ')} label="Schedule" />}
              {student.phone && <Info icon="📞" text={student.phone} label="Phone" />}
            </div>
          </div>
          <button onClick={() => navigate(`/students/${id}/edit`)} style={{ background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '8px 14px', borderRadius: 9, cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600 }}>
            Edit
          </button>
        </div>
      </Card>

      {/* Payment stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 18 }}>
        <Card>
          <p style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>Total Paid</p>
          <p style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--green)', marginTop: 6 }}>{fmt(student.totalPaid)}</p>
        </Card>
        <Card style={{ background: student.due > 0 ? 'var(--red-bg)' : 'var(--card)', border: student.due > 0 ? '1px solid var(--red)' : '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>This Month Due</p>
          <p style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, color: student.due > 0 ? 'var(--red)' : 'var(--text3)', marginTop: 6 }}>{fmt(student.due)}</p>
        </Card>
        <Card style={{ background: student.advance > 0 ? 'var(--orange-bg)' : 'var(--card)', border: student.advance > 0 ? '1px solid var(--orange)' : '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>Advance</p>
          <p style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, color: student.advance > 0 ? 'var(--orange)' : 'var(--text3)', marginTop: 6 }}>{fmt(student.advance)}</p>
        </Card>
      </div>

      {/* Record Payment */}
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>Record Payment</h3>
          <button onClick={() => setPaying(!paying)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            {paying ? 'Cancel' : '+ Record'}
          </button>
        </div>

        {paying && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, animation: 'fadeUp 0.3s ease' }}>
            <Field label="Amount (৳)" required>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </Field>
            <Field label="Month">
              <select value={form.month} onChange={e => setForm(f => ({ ...f, month: parseInt(e.target.value) }))}>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m} {form.year}</option>)}
              </select>
            </Field>
            <Field label="Year">
              <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) }))} />
            </Field>
            <Field label="Type">
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="regular">Regular</option>
                <option value="advance">Advance</option>
                <option value="partial">Partial</option>
              </select>
            </Field>
            <Field label="Note (optional)" >
              <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Optional note..." />
            </Field>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Btn onClick={handlePay} disabled={saving} fullWidth>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {saving ? 'Saving...' : 'Record Payment'}
              </Btn>
            </div>
          </div>
        )}
      </Card>

      {/* Payment history */}
      <Card>
        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 16 }}>Payment History</h3>
        {!student.payments?.length ? (
          <p style={{ color: 'var(--text3)', fontSize: '0.88rem', textAlign: 'center', padding: 20 }}>No payments recorded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {student.payments.map((p, i) => (
              <div key={p._id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '11px 12px',
                borderRadius: 10, animation: `fadeUp 0.3s ease ${i * 0.04}s both`
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--green-bg)', display: 'grid', placeItems: 'center', color: 'var(--green)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{MONTHS[p.month - 1]} {p.year}</span>
                  {p.note && <span style={{ color: 'var(--text3)', fontSize: '0.78rem', marginLeft: 8 }}>{p.note}</span>}
                  <div style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>
                    {new Date(p.paymentDate).toLocaleDateString()} · {p.type}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--green)', marginRight: 8 }}>{fmt(p.amount)}</span>
                <button onClick={() => handleDeletePayment(p._id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'grid', placeItems: 'center' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function Info({ icon, text, label }) {
  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 5 }}>{icon} {text}</p>
    </div>
  )
}
