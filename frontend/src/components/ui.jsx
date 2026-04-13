// Card
export function Card({ children, style = {}, className = '' }) {
  return (
    <div className={className} style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '20px 22px', ...style
    }}>
      {children}
    </div>
  )
}

// Badge
export function Badge({ children, color = 'accent' }) {
  const colors = {
    accent:  { bg: 'var(--accent-glow)', text: 'var(--accent2)' },
    green:   { bg: 'var(--green-bg)',    text: 'var(--green)'   },
    red:     { bg: 'var(--red-bg)',      text: 'var(--red)'     },
    orange:  { bg: 'var(--orange-bg)',   text: 'var(--orange)'  },
    muted:   { bg: 'rgba(255,255,255,0.06)', text: 'var(--text2)' },
  }
  const c = colors[color] || colors.muted
  return (
    <span style={{
      background: c.bg, color: c.text, padding: '4px 10px',
      borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap'
    }}>
      {children}
    </span>
  )
}

// Button
export function Btn({ children, onClick, variant = 'primary', style = {}, disabled = false, type = 'button', fullWidth = false }) {
  const variants = {
    primary:  { background: 'var(--accent)', color: 'white', border: 'none', boxShadow: '0 4px 18px var(--accent-glow)' },
    danger:   { background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid var(--red)', boxShadow: 'none' },
    ghost:    { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)', boxShadow: 'none' },
    green:    { background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid var(--green)', boxShadow: 'none' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...variants[variant], padding: '10px 20px', borderRadius: 10,
      fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex',
      alignItems: 'center', gap: 8, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, transition: 'all 0.18s', width: fullWidth ? '100%' : undefined,
      justifyContent: fullWidth ? 'center' : undefined, ...style
    }}>
      {children}
    </button>
  )
}

// Page header
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.65rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--text3)', fontSize: '0.88rem', marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// Stat card
export function StatCard({ icon, label, value, sub, color = 'var(--accent)', style = {} }) {
  return (
    <Card style={{ ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text3)', textTransform: 'uppercase' }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: color + '22', display: 'grid', placeItems: 'center', color }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.7rem', fontWeight: 700, color: 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.77rem', color: 'var(--text3)', marginTop: 5 }}>{sub}</div>}
    </Card>
  )
}

// Avatar
export function Avatar({ name = '', size = 42, color = 'var(--accent)' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 3, background: color + '33',
      border: `1.5px solid ${color}55`, display: 'grid', placeItems: 'center',
      fontFamily: 'var(--font-head)', fontWeight: 700,
      fontSize: size * 0.4, color, flexShrink: 0,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

// Input label wrapper
export function Field({ label, children, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: 'var(--red)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

// Loading spinner
export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
      <div style={{
        width: 36, height: 36, border: '3px solid var(--border)',
        borderTop: '3px solid var(--accent)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// Empty state
export function Empty({ icon, message, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '52px 24px', color: 'var(--text3)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{icon || '📭'}</div>
      <p style={{ fontSize: '0.95rem' }}>{message}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  )
}

// Month names
export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
export const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// Format BDT
export const fmt = (n) => `৳${Number(n || 0).toLocaleString()}`

// Avatar colors by letter
export const avatarColor = (name = '') => {
  const colors = ['#7c6cfc','#22d39a','#f4546e','#f59e0b','#3b82f6','#ec4899','#14b8a6']
  return colors[name.charCodeAt(0) % colors.length]
}
