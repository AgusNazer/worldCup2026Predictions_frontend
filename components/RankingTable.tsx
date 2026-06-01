import useIsMobile from '@/components/useIsMobile'
import { RankingEntry } from '@/types'

export default function RankingTable({ entries }: { entries: RankingEntry[] }) {
  const isMobile = useIsMobile()

  if (!entries.length) {
    return <div style={styles.empty}>Sin datos</div>
  }

  return (
    <div style={styles.table}>
      <div style={{ ...styles.header, ...(isMobile ? styles.headerMobile : {}) }}>
        <div style={{ ...styles.cell, ...styles.colPos }}>#</div>
        <div style={{ ...styles.cell, ...styles.colUser }}>Usuario</div>
        <div style={{ ...styles.cell, textAlign: 'right' }}>Puntos</div>
        <div style={{ ...styles.cell, textAlign: 'right' }}>Predicciones</div>
      </div>

      <div style={styles.body}>
        {entries.map((entry) => (
          <div key={entry.user_id} style={{ ...styles.row, ...(isMobile ? styles.rowMobile : {}) }}>
            <div style={{ ...styles.cell, ...styles.colPos, color: 'var(--color-accent-yellow)' }}>
              {entry.position}
            </div>
            <div style={{ ...styles.cell, ...styles.colUser, fontWeight: 500 }}>
              {entry.username}
            </div>
            <div style={{ ...styles.cell, textAlign: 'right', color: 'var(--color-accent-pink)', fontWeight: 700 }}>
              {entry.total_points}
            </div>
            <div style={{ ...styles.cell, textAlign: 'right', color: 'var(--color-text-dim)' }}>
              {entry.total_predictions}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  table: {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
  } as React.CSSProperties,

  header: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 120px 140px',
    padding: '12px 16px',
    backgroundColor: 'var(--color-surface-light)',
    borderBottom: '1px solid var(--color-divider)',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    fontSize: '13px',
  } as React.CSSProperties,

  headerMobile: {
    gridTemplateColumns: '48px 1fr 76px 90px',
    padding: '10px 12px',
    fontSize: '12px',
  } as React.CSSProperties,

  body: {
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,

  row: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 120px 140px',
    padding: '12px 16px',
    alignItems: 'center',
    borderBottom: '1px solid var(--color-divider)',
  } as React.CSSProperties,

  rowMobile: {
    gridTemplateColumns: '48px 1fr 76px 90px',
    padding: '10px 12px',
  } as React.CSSProperties,

  cell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '14px',
  } as React.CSSProperties,

  colPos: {
    fontWeight: 700,
  } as React.CSSProperties,

  colUser: {
    paddingLeft: '8px',
  } as React.CSSProperties,

  empty: {
    padding: '32px',
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
  } as React.CSSProperties,
}
