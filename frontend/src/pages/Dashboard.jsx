import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getReportSummary, getStudents, getPayments, getProfile } from '../api'
import { Card, StatCard, Avatar, Badge, Spinner, fmt, avatarColor, MONTHS } from '../components/ui'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [students, setStudents] = useState([])
  const [payments, setPayments] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const now = new Date()

  useEffect(() => {
    Promise.all([
      getReportSummary(),
      getStudents({ active: true }),
      getPayments({ limit: 5 }),
      getProfile()
    ]).then(([s, st, p, pr]) => {
      setSummary(s.data)
      setStudents(st.data.slice(0, 5))
      setPayments(p.data)
      setProfile(pr.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const pct = summary?.monthlyTarget > 0
    ? Math.min(100, Math.round((summary.collected / summary.monthlyTarget) * 100))
    : 0

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.7rem', fontWeight: 800, color: 'var(--text)' }}>
          Good {now.getHours() < 12 ? 'Morning' : now.getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: '0.88rem', marginTop: 5 }}>
          {MONTHS[now.getMonth()]} {now.getFullYear()} overview — {profile?.tutorName || 'Tuition Porai'}
        </p>
      </div>

      {/* Target progress */}
      {summary?.monthlyTarget > 0 && (
        <Card style={{ marginBottom: 20, background: 'linear-gradient(135deg, #1a1635 0%, var(--card) 100%)', border: '1px solid #3a3060' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text3)', textTransform: 'uppercase' }}>Monthly Target Progress</p>
              <p style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginTop: 4 }}>
                {fmt(summary.collected)} <span style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>/ {fmt(summary.monthlyTarget)}</span>
              </p>
            </div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 800, color: pct >= 100 ? 'var(--green)' : 'var(--accent)' }}>
              {pct}%
            </div>
          </div>
          <div style={{ height: 8, background: 'var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 10, width: `${pct}%`,
              background: pct >= 100 ? 'var(--green)' : 'var(--accent)',
              boxShadow: `0 0 12px ${pct >= 100 ? 'var(--green)' : 'var(--accent)'}66`,
              transition: 'width 1s ease'
            }} />
          </div>
        </Card>
      )}

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard icon={<$Icon />} label="Collected" value={fmt(summary?.collected)} sub="This month" color="var(--green)" />
        <StatCard icon={<AlertIcon />} label="Total Dues" value={fmt(summary?.dues)} sub="Pending" color="var(--red)" />
        <StatCard icon={<WalletIcon />} label="Advance" value={fmt(summary?.advance)} sub="Pre-paid" color="var(--orange)" />
        <StatCard icon={<UsersIcon />} label="New Students" value={summary?.newStudents ?? 0} sub="This month" color="var(--accent)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        {/* Recent Students */}
        <Card style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem' }}>Recent Students</h3>
            <button onClick={() => navigate('/students')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer' }}>
              See All →
            </button>
          </div>
          {students.length === 0 && <p style={{ color: 'var(--text3)', fontSize: '0.88rem', textAlign: 'center', padding: '16px 0' }}>No students yet. Add your first student!</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {students.map((s, i) => (
              <div key={s._id} onClick={() => navigate(`/students/${s._id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '11px 12px',
                  borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s',
                  animation: `fadeUp 0.3s ease ${i * 0.05}s both`
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--card2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Avatar name={s.name} color={avatarColor(s.name)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.93rem' }}>{s.name}</div>
                  <div style={{ color: 'var(--text3)', fontSize: '0.78rem' }}>Class {s.class} {s.batch?.name ? `• ${s.batch.name}` : ''}</div>
                </div>
                {s.due > 0
                  ? <Badge color="red">Due {fmt(s.due)}</Badge>
                  : <Badge color="green">Paid ✓</Badge>
                }
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem' }}>Recent Transactions</h3>
            <button onClick={() => navigate('/reports')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer' }}>
              View Report →
            </button>
          </div>
          {payments.length === 0 && <p style={{ color: 'var(--text3)', fontSize: '0.88rem', textAlign: 'center', padding: '16px 0' }}>No transactions yet.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {payments.map((p, i) => (
              <div key={p._id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '11px 12px',
                borderRadius: 10, animation: `fadeUp 0.3s ease ${i * 0.05}s both`
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--green-bg)', display: 'grid', placeItems: 'center', color: 'var(--green)', flexShrink: 0 }}>
                  <$Icon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.93rem' }}>{p.student?.name || '—'}</div>
                  <div style={{ color: 'var(--text3)', fontSize: '0.78rem' }}>
                    {MONTHS[(p.month || 1) - 1]} {p.year} · {new Date(p.paymentDate).toLocaleDateString()}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--green)', fontSize: '0.95rem' }}>{fmt(p.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginTop: 18 }}>
        <button onClick={() => navigate('/students/add')} style={{
          background: 'var(--card)', border: '1px dashed var(--accent)', borderRadius: 14,
          padding: '18px', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'var(--font-head)', fontSize: '0.95rem', transition: 'all 0.18s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-glow)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Student
        </button>
        <button onClick={() => navigate('/batches')} style={{
          background: 'var(--card)', border: '1px dashed var(--orange)', borderRadius: 14,
          padding: '18px', color: 'var(--orange)', fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'var(--font-head)', fontSize: '0.95rem', transition: 'all 0.18s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--orange-bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          Manage Batches
        </button>
      </div>
    </div>
  )
}

function $Icon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function AlertIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> }
function WalletIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> }
function UsersIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
