import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudents, deleteStudent } from '../api'
import { Card, Badge, Avatar, Btn, PageHeader, Spinner, Empty, fmt, avatarColor } from '../components/ui'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | due | paid
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    getStudents({ active: true }).then(r => setStudents(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'due' && s.due > 0) || (filter === 'paid' && s.due === 0)
    return matchSearch && matchFilter
  })

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}? This will also remove all payment records.`)) return
    await deleteStudent(id)
    load()
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <PageHeader
        title="Students"
        subtitle={`${students.length} total students`}
        action={<Btn onClick={() => navigate('/students/add')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Student
        </Btn>}
      />

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <svg style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or class..." style={{ paddingLeft: 40 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'due', 'paid'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border)',
              background: filter === f ? 'var(--accent)' : 'var(--card)',
              color: filter === f ? 'white' : 'var(--text2)',
              fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', textTransform: 'capitalize'
            }}>
              {f === 'all' ? 'All' : f === 'due' ? 'Has Due' : 'Paid'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <Empty icon="🎓" message={search ? 'No students match your search.' : 'No students yet. Add your first one!'}
          action={!search && <Btn onClick={() => navigate('/students/add')}>Add Student</Btn>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((s, i) => (
            <Card key={s._id} style={{ padding: '14px 18px', cursor: 'pointer', animation: `fadeUp 0.3s ease ${i * 0.04}s both`, transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div onClick={() => navigate(`/students/${s._id}`)} style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                  <Avatar name={s.name} color={avatarColor(s.name)} size={44} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.97rem', marginBottom: 3 }}>{s.name}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>Class {s.class}</span>
                      {s.batch?.name && <span style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>• {s.batch.name}</span>}
                      <span style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>• {fmt(s.monthlyFee)}/mo</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginRight: 8 }}>
                    {s.due > 0 ? <Badge color="red">Due {fmt(s.due)}</Badge>
                      : s.advance > 0 ? <Badge color="orange">Advance {fmt(s.advance)}</Badge>
                        : <Badge color="green">Paid ✓</Badge>}
                    {s.schedule?.length > 0 && (
                      <div style={{ color: 'var(--text3)', fontSize: '0.75rem', marginTop: 5 }}>{s.schedule.join(', ')}</div>
                    )}
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => navigate(`/students/${s._id}`)} style={{ background: 'var(--accent-glow)', border: 'none', color: 'var(--accent)', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button onClick={() => handleDelete(s._id, s.name)} style={{ background: 'var(--red-bg)', border: 'none', color: 'var(--red)', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
