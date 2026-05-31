'use client'

import { Match } from '@/types'

interface MatchCardProps {
  match: Match
  onPredict?: (matchId: number) => void
}

export default function MatchCard({ match, onPredict }: MatchCardProps) {
  const isFinished = match.status === 'finished'
  const isOngoing = match.status === 'ongoing'
  const isScheduled = match.status === 'scheduled'

  const matchDate = new Date(match.match_date)
  const dateStr = matchDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  const timeStr = matchDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={getCardStyle(isFinished, isOngoing)}>
      <div style={styles.header}>
        <span style={styles.date}>{dateStr} • {timeStr}</span>
        <span style={getStatusStyle(match.status)}>{match.status}</span>
      </div>

      <div style={styles.matchContainer}>
        <div style={styles.team}>
          <span style={styles.teamName}>{match.team_a}</span>
        </div>

        <div style={styles.vs}>
          {isFinished ? (
            <div style={styles.score}>
              <span style={{ color: 'var(--color-accent-yellow)', fontWeight: 900 }}>
                {match.score_a}
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>-</span>
              <span style={{ color: 'var(--color-accent-yellow)', fontWeight: 900 }}>
                {match.score_b}
              </span>
            </div>
          ) : (
            <span style={styles.vsText}>VS</span>
          )}
        </div>

        <div style={styles.team}>
          <span style={styles.teamName}>{match.team_b}</span>
        </div>
      </div>

      {isScheduled && onPredict && (
        <button style={styles.predictBtn} onClick={() => onPredict(match.id)}>
          Predecir
        </button>
      )}
    </div>
  )
}

function getCardStyle(isFinished: boolean, isOngoing: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    marginBottom: '12px',
  }

  if (isFinished) {
    return { ...base, opacity: 0.7 }
  }
  if (isOngoing) {
    return { ...base, borderColor: 'var(--color-accent-lime)' }
  }
  return base
}

function getStatusStyle(status: string): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '4px 8px',
    borderRadius: 'var(--radius-xs)',
    letterSpacing: '0.5px',
  }

  const statusColors: Record<string, React.CSSProperties> = {
    scheduled: { backgroundColor: 'rgba(0, 217, 255, 0.1)', color: 'var(--color-accent-cyan)' },
    ongoing: { backgroundColor: 'rgba(57, 255, 20, 0.1)', color: 'var(--color-accent-lime)' },
    finished: { backgroundColor: 'rgba(255, 51, 102, 0.1)', color: 'var(--color-accent-pink)' },
  }

  return { ...baseStyle, ...(statusColors[status] || {}) }
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  } as React.CSSProperties,

  date: {
    fontWeight: 500,
  } as React.CSSProperties,

  matchContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 80px 1fr',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '12px',
    padding: '12px 0',
  } as React.CSSProperties,

  team: {
    textAlign: 'center',
  } as React.CSSProperties,

  teamName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text)',
  } as React.CSSProperties,

  vs: {
    textAlign: 'center',
  } as React.CSSProperties,

  vsText: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--color-text-muted)',
  } as React.CSSProperties,

  score: {
    display: 'flex',
    gap: '4px',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties,

  predictBtn: {
    width: '100%',
    background: 'linear-gradient(90deg, #ff2b4f 0%, #ff6b5f 25%, #ffd700 50%, #4aa8ff 75%, #1ed760 100%)',
    color: '#000',
    border: 'none',
    padding: '8px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 150ms ease',
    backgroundSize: '200% 100%',
  } as React.CSSProperties,
}
