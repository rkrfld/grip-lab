import type { Session, Attempt } from './types'
import { toVLabel } from './gradeConversion'

export interface RecapGradeBar {
  grade: string
  sends: number
  pct: number
}

export interface RecapData {
  username: string
  date: string
  gymName: string | null
  bestGrade: string | null
  totalSends: number
  totalAttempts: number
  sessionDuration: number | null
  attempts: Attempt[]
  gradeBreakdown: RecapGradeBar[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}`
}

export function deriveRecap(session: Session, username = 'climber', gymName: string | null = null): RecapData {
  const attempts = session.attempts ?? []
  const sends = attempts.filter(a => a.result === 'send')
  const maxSendV = sends.reduce((m, a) => Math.max(m, a.v_grade ?? -1), -1)

  const sendsByV: Record<number, number> = {}
  sends.forEach(a => {
    const v = a.v_grade ?? 0
    sendsByV[v] = (sendsByV[v] ?? 0) + 1
  })
  const maxBarCount = Math.max(1, ...Object.values(sendsByV))
  const gradeBreakdown: RecapGradeBar[] = Object.entries(sendsByV)
    .map(([v, count]) => ({
      grade: toVLabel(parseInt(v)),
      sends: count,
      pct: (count / maxBarCount) * 100,
    }))
    .sort((a, b) => parseInt(b.grade.replace(/\D/g, '')) - parseInt(a.grade.replace(/\D/g, '')))

  return {
    username,
    date: formatDate(session.session_date),
    gymName,
    bestGrade: maxSendV >= 0 ? toVLabel(maxSendV) : null,
    totalSends: sends.length,
    totalAttempts: attempts.length,
    sessionDuration: session.duration_minutes,
    attempts,
    gradeBreakdown,
  }
}
