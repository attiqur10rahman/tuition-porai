import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
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

        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.sub}>Log in to your teacher account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={styles.input} />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={styles.switch}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>Sign up free</Link>
        </p>
      </div>

      <Footer />
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
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 420 },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 },
  logoIcon: { width: 40, height: 40, borderRadius: 10, background: 'var(--accent)', display: 'grid', placeItems: 'center', boxShadow: '0 0 18px var(--accent-glow)' },
  logoText: { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.1rem' },
  title: { fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 },
  sub: { color: 'var(--text3)', fontSize: '0.88rem', marginBottom: 24 },
  error: { background: 'var(--red-bg)', border: '1px solid var(--red)', color: 'var(--red)', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase' },
  input: { background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', color: 'var(--text)', fontSize: '0.95rem', outline: 'none', width: '100%' },
  btn: { background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: 4, boxShadow: '0 4px 18px var(--accent-glow)', transition: 'opacity 0.2s' },
  switch: { textAlign: 'center', color: 'var(--text3)', fontSize: '0.85rem', marginTop: 20 },
  link: { color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' },
}
