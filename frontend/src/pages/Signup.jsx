import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', tutionName: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      await signup(form.name, form.email, form.password, form.tutionName, form.phone)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <span style={styles.logoText}>Tuition Porai</span>
        </div>

        <h2 style={styles.title}>Create your account</h2>
        <p style={styles.sub}>Start managing your tuition for free</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.row}>
            <Field label="Your Full Name *">
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Md Attiqur Rahman" required style={styles.input} />
            </Field>
            <Field label="Tuition Name">
              <input type="text" value={form.tutionName} onChange={e => set('tutionName', e.target.value)} placeholder="e.g. Tuition Porai" style={styles.input} />
            </Field>
          </div>
          <Field label="Email Address *">
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" required style={styles.input} />
          </Field>
          <Field label="Phone Number">
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="01700000000" style={styles.input} />
          </Field>
          <Field label="Password *">
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" required style={styles.input} />
          </Field>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switch}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Log in</Link>
        </p>
      </div>

      <Footer />
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  )
}

function Footer() {
  return (
    <div style={{ textAlign: 'center', marginTop: 28, color: 'var(--text3)', fontSize: '0.78rem' }}>
      Developed by <span style={{ color: 'var(--text2)' }}>Md Attiqur Rahman</span> ·{' '}
      <a href="mailto:attiqur10rahman@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>attiqur10rahman@gmail.com</a>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: 'var(--bg)', animation: 'fadeUp 0.4s ease' },
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px 36px', width: '100%', maxWidth: 480 },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 },
  logoIcon: { width: 40, height: 40, borderRadius: 10, background: 'var(--accent)', display: 'grid', placeItems: 'center', boxShadow: '0 0 18px var(--accent-glow)' },
  logoText: { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.1rem' },
  title: { fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 },
  sub: { color: 'var(--text3)', fontSize: '0.88rem', marginBottom: 24 },
  error: { background: 'var(--red-bg)', border: '1px solid var(--red)', color: 'var(--red)', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: 12 },
  input: { background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 16px', color: 'var(--text)', fontSize: '0.93rem', outline: 'none', width: '100%' },
  btn: { background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: 4, boxShadow: '0 4px 18px var(--accent-glow)' },
  switch: { textAlign: 'center', color: 'var(--text3)', fontSize: '0.85rem', marginTop: 20 },
  link: { color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' },
}
