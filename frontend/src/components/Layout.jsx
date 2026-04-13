import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Nav order: Dashboard, Profile, Students, Batches, Reports, Today
const NAV = [
  { to: '/',         icon: <GridIcon />,    label: 'Dashboard' },
  { to: '/settings', icon: <UserIcon />,    label: 'Profile' },
  { to: '/students', icon: <UsersIcon />,   label: 'Students' },
  { to: '/batches',  icon: <LayersIcon />,  label: 'Batches' },
  { to: '/reports',  icon: <ChartIcon />,   label: 'Reports' },
  { to: '/today',    icon: <CalIcon />,     label: 'Today' },
]

// Mobile bottom nav (5 items max — hide Profile, accessible via sidebar)
const BOTTOM_NAV = [
  { to: '/',         icon: <GridIcon />,   label: 'Home' },
  { to: '/students', icon: <UsersIcon />,  label: 'Students' },
  { to: '/today',    icon: <CalIcon />,    label: 'Today' },
  { to: '/reports',  icon: <ChartIcon />,  label: 'Reports' },
  { to: '/batches',  icon: <LayersIcon />, label: 'Batches' },
]

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isDashboard = location.pathname === '/'

  useEffect(() => {
    setVisible(false)
    setDrawerOpen(false)
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="desktop-sidebar" style={{
        width: 'var(--sidebar-w)', background: 'var(--bg2)',
        borderRight: '1px solid var(--border)', display: 'flex',
        flexDirection: 'column', position: 'fixed', top: 0, left: 0,
        height: '100vh', zIndex: 50,
      }}>
        <SidebarContent nav={NAV} user={user} onLogout={handleLogout} onAdd={() => navigate('/students/add')} />
      </aside>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          zIndex: 60, backdropFilter: 'blur(2px)'
        }} />
      )}

      {/* ── MOBILE DRAWER ── */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100vh',
        width: 260, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        zIndex: 70, display: 'flex', flexDirection: 'column',
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
      }} className="mobile-drawer">
        <SidebarContent nav={NAV} user={user} onLogout={handleLogout} onAdd={() => { navigate('/students/add'); setDrawerOpen(false) }} />
      </aside>

      {/* ── MAIN ── */}
      <div className="main-wrap" style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Mobile topbar */}
        <header className="mobile-topbar" style={{
          display: 'none', padding: '13px 18px', background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)', alignItems: 'center',
          justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30,
        }}>
          <button onClick={() => setDrawerOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text)', padding: 4, cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem' }}>Tuition Porai</span>
          </div>
          <button onClick={() => navigate('/students/add')} style={{ background: 'var(--accent)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: 8, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </header>

        {/* Page content */}
        <main className="page-main" style={{
          flex: 1, padding: '32px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.28s ease, transform 0.28s ease',
        }}>
          <Outlet />
        </main>

        {/* Footer — only on Dashboard */}
        {isDashboard && (
          <footer className="page-footer" style={{
            padding: '14px 32px', borderTop: '1px solid var(--border)',
            textAlign: 'center', color: 'var(--text3)', fontSize: '0.76rem',
          }}>
            Developed by <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Md Attiqur Rahman</span>
            {' · '}
            <a href="mailto:attiqur10rahman@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              attiqur10rahman@gmail.com
            </a>
          </footer>
        )}
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="mobile-bottomnav" style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--bg2)', borderTop: '1px solid var(--border)',
        zIndex: 50, padding: '6px 4px 10px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {BOTTOM_NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '4px 8px', borderRadius: 10, textDecoration: 'none',
              color: isActive ? 'var(--accent)' : 'var(--text3)',
              background: isActive ? 'var(--accent-glow)' : 'transparent',
              transition: 'all 0.15s', minWidth: 50,
            })}>
              {icon}
              <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .main-wrap { margin-left: 0 !important; padding-bottom: 72px; }
          .mobile-topbar { display: flex !important; }
          .mobile-bottomnav { display: block !important; }
          .page-main { padding: 16px !important; }
          .page-footer { padding: 10px 16px !important; }
        }
      `}</style>
    </div>
  )
}

function SidebarContent({ nav, user, onLogout, onAdd }) {
  return (
    <>
      <div style={{ padding: '26px 22px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent)', display: 'grid', placeItems: 'center', boxShadow: '0 0 18px var(--accent-glow)', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Tuition Porai</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.tutionName || 'Management System'}</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
        {nav.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
            borderRadius: 10, fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none',
            color: isActive ? 'white' : 'var(--text2)',
            background: isActive ? 'var(--accent)' : 'transparent',
            boxShadow: isActive ? '0 4px 14px var(--accent-glow)' : 'none',
            transition: 'all 0.18s',
          })}>{icon}{label}</NavLink>
        ))}
      </nav>

      <div style={{ padding: '14px 10px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {user && (
          <div style={{ padding: '10px 14px', background: 'var(--card2)', borderRadius: 10 }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
          </div>
        )}
        <button onClick={onAdd} style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: 'var(--accent-glow)', color: 'var(--accent2)', fontWeight: 600, fontSize: '0.87rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Add Student
        </button>
        <button onClick={onLogout}
          style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--red)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-bg)'; e.currentTarget.style.borderColor = 'var(--red)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log Out
        </button>
      </div>
    </>
  )
}

function GridIcon()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> }
function UserIcon()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function UsersIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function LayersIcon(){ return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> }
function ChartIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function CalIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
