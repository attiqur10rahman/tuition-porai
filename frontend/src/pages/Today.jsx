import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudents, getBatches } from '../api'
import { Card, Avatar, Badge, Spinner, Empty, avatarColor } from '../components/ui'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Today() {
  const [students, setStudents] = useState([])
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const now = new Date()
  const todayDay = DAYS[now.getDay()]
  const dateStr = `${todayDay}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  useEffect(() => {
    Promise.all([getStudents({ active: true }), getBatches()])
      .then(([s, b]) => { setStudents(s.data); setBatches(b.data) })
      .finally(() => setLoading(false))
  }, [])

  const todayStudents = students.filter(s =>
    s.schedule?.some(d => d.toLowerCase() === todayDay.toLowerCase())
  )
  const todayBatches = batches.filter(b =>
    b.schedule?.some(d => d.toLowerCase() === todayDay.toLowerCase())
  )
  const total = todayStudents.length + todayBatches.length

  if (loading) return <Spinner />

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', maxWidth: 700 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.7rem', fontWeight: 800 }}>
          Today's Schedule
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: '0.88rem', marginTop: 4 }}>{dateStr}</p>
      </div>

      {/* Summary card */}
      <Card style={{
        marginBottom: 20,
        background: total > 0 ? 'linear-gradient(135deg,#1a1635 0%,var(--card) 100%)' : 'var(--card)',
        border: total > 0 ? '1px solid #3a3060' : '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: total > 0 ? 'var(--accent)' : 'var(--card2)',
            display: 'grid', placeItems: 'center',
            boxShadow: total > 0 ? '0 0 20px var(--accent-glow)' : 'none',
            flexShrink: 0
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 4 }}>Total classes today</p>
            <p style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 800 }}>
              {total} {total === 1 ? 'Class' : 'Classes'}
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>
              {todayStudents.length} {todayStudents.length === 1 ? 'private class' : 'private classes'}
              {' · '}
              {todayBatches.length} {todayBatches.length === 1 ? 'batch' : 'batches'}
            </p>
          </div>
        </div>
      </Card>

      {total === 0 ? (
        <Empty
          icon="🎉"
          message={`No classes scheduled for today (${todayDay}). Enjoy your day off!`}
          action={
            <button onClick={() => navigate('/students')} style={{
              background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: 10, padding: '10px 20px', fontWeight: 600,
              fontSize: '0.88rem', cursor: 'pointer'
            }}>
              View Students
            </button>
          }
        />
      ) : (
        <>
          {/* Today's Batches */}
          {todayBatches.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 4, height: 18, background: 'var(--orange)', borderRadius: 2 }} />
                <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700 }}>
                  Batch Classes
                </h2>
                <Badge color="orange">{todayBatches.length}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {todayBatches.map((b, i) => {
                  const col = avatarColor(b.name)
                  return (
                    <Card key={b._id} style={{
                      padding: '14px 18px',
                      border: `1px solid ${col}33`,
                      animation: `fadeUp 0.3s ease ${i * 0.06}s both`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: col + '22', display: 'grid',
                          placeItems: 'center', fontSize: '1.2rem', flexShrink: 0
                        }}>📚</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{b.name}</div>
                          <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                            {b.subject && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{b.subject}</span>
                            )}
                            {b.time && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--accent)' }}>🕐 {b.time}</span>
                            )}
                            <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
                              {b.studentCount} {b.studentCount === 1 ? 'student' : 'students'}
                            </span>
                          </div>
                        </div>
                        <Badge color="orange">Batch</Badge>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Individual students */}
          {todayStudents.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 4, height: 18, background: 'var(--accent)', borderRadius: 2 }} />
                <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700 }}>
                  Private Classes
                </h2>
                <Badge color="accent">{todayStudents.length}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {todayStudents.map((s, i) => {
                  const col = avatarColor(s.name)
                  return (
                    <Card key={s._id}
                      onClick={() => navigate(`/students/${s._id}`)}
                      style={{
                        padding: '12px 16px', cursor: 'pointer',
                        animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
                        transition: 'border-color 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar name={s.name} color={col} size={42} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.93rem' }}>{s.name}</div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>Class {s.class}</span>
                            {s.subject && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>· {s.subject}</span>
                            )}
                            {s.batch?.name && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>· {s.batch.name}</span>
                            )}
                          </div>
                        </div>
                        {s.due > 0
                          ? <Badge color="red">Due {s.due}</Badge>
                          : <Badge color="green">Paid ✓</Badge>
                        }
                        <svg style={{ color: 'var(--text3)', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Tip */}
      <div style={{
        marginTop: 24, padding: '12px 16px',
        background: 'var(--card2)', borderRadius: 10,
        border: '1px dashed var(--border)'
      }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text3)', lineHeight: 1.6 }}>
          💡 To update a student's schedule, go to their profile page. To update a batch schedule, go to the Batches page.
        </p>
      </div>
    </div>
  )
}
