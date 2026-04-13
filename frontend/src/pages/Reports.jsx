import { useEffect, useState } from 'react'
import { getReportSummary, getMonthlyReport, getDuesReport } from '../api'
import { Card, Badge, PageHeader, Spinner, fmt, MONTHS } from '../components/ui'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const now = new Date()

export default function Reports() {
  const [summary, setSummary] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [dues, setDues] = useState([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [tab, setTab] = useState('overview')

  const load = () => {
    setLoading(true)
    Promise.all([
      getReportSummary({ month, year }),
      getMonthlyReport(),
      getDuesReport({ month, year })
    ]).then(([s, m, d]) => {
      setSummary(s.data)
      setMonthly(m.data.map(r => ({ name: `${MONTHS[r.month - 1]} ${r.year}`, collected: r.collected, expected: r.expected })))
      setDues(d.data)
    }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [month, year])

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <PageHeader title="Financial Reports" subtitle="Track income, dues, and trends" />

      {/* Month selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={month} onChange={e => setMonth(parseInt(e.target.value))} style={{ width: 'auto' }}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} style={{ width: 100 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {['overview', 'dues', 'chart'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '9px 16px', borderRadius: 9, border: '1px solid var(--border)',
              background: tab === t ? 'var(--accent)' : 'var(--card)',
              color: tab === t ? 'white' : 'var(--text2)',
              fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', textTransform: 'capitalize'
            }}>{t}</button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* Overview tab */}
          {tab === 'overview' && (
            <div style={{ animation: 'fadeUp 0.3s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 20 }}>
                {[
                  { label: 'Expected', value: fmt(summary?.expected), color: 'var(--accent)' },
                  { label: 'Collected', value: fmt(summary?.collected), color: 'var(--green)' },
                  { label: 'Total Dues', value: fmt(summary?.dues), color: 'var(--red)' },
                  { label: 'Advance Paid', value: fmt(summary?.advance), color: 'var(--orange)' },
                ].map(({ label, value, color }) => (
                  <Card key={label}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                    <p style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 700, color, marginTop: 8 }}>{value}</p>
                  </Card>
                ))}
              </div>

              {/* Collection rate */}
              {summary?.expected > 0 && (
                <Card style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text2)' }}>Collection Rate</span>
                    <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--green)' }}>
                      {Math.round((summary.collected / summary.expected) * 100)}%
                    </span>
                  </div>
                  <div style={{ height: 10, background: 'var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 10,
                      width: `${Math.min(100, (summary.collected / summary.expected) * 100)}%`,
                      background: 'var(--green)', boxShadow: '0 0 12px var(--green)66', transition: 'width 1s ease'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text3)' }}>৳0</span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text3)' }}>{fmt(summary.expected)}</span>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Dues tab */}
          {tab === 'dues' && (
            <div style={{ animation: 'fadeUp 0.3s ease' }}>
              <Card>
                <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 16 }}>
                  Student Payment Status — {MONTHS[month - 1]} {year}
                </h3>
                {dues.length === 0 ? <p style={{ color: 'var(--text3)', textAlign: 'center', padding: 20 }}>No students found.</p> : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                      <thead>
                        <tr>
                          {['Student', 'Class', 'Fee', 'Paid', 'Due', 'Status'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text3)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dues.map((d, i) => (
                          <tr key={d._id} style={{ borderBottom: '1px solid var(--border)', animation: `fadeUp 0.3s ease ${i * 0.04}s both` }}>
                            <td style={{ padding: '12px 12px', fontWeight: 600 }}>{d.name}</td>
                            <td style={{ padding: '12px 12px', color: 'var(--text3)' }}>{d.class}</td>
                            <td style={{ padding: '12px 12px' }}>{fmt(d.monthlyFee)}</td>
                            <td style={{ padding: '12px 12px', color: 'var(--green)' }}>{fmt(d.paid)}</td>
                            <td style={{ padding: '12px 12px', color: d.due > 0 ? 'var(--red)' : 'var(--text3)' }}>{fmt(d.due)}</td>
                            <td style={{ padding: '12px 12px' }}>
                              <Badge color={d.status === 'paid' ? 'green' : d.status === 'partial' ? 'orange' : 'red'}>
                                {d.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Chart tab */}
          {tab === 'chart' && (
            <div style={{ animation: 'fadeUp 0.3s ease' }}>
              <Card>
                <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 20 }}>Last 6 Months Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthly} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `৳${v}`} />
                    <Tooltip
                      contentStyle={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)' }}
                      formatter={(v) => [fmt(v)]}
                    />
                    <Bar dataKey="expected" fill="var(--border)" radius={[5, 5, 0, 0]} name="Expected" />
                    <Bar dataKey="collected" fill="var(--accent)" radius={[5, 5, 0, 0]} name="Collected" />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--border)' }} /><span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>Expected</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--accent)' }} /><span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>Collected</span></div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
