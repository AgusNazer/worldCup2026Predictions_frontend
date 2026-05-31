interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  title?: string
}

export default function Card({ title, children, ...props }: CardProps) {
  return (
    <div style={styles.card} {...props}>
      {title && <h2 style={styles.title}>{title}</h2>}
      <div style={styles.content}>{children}</div>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  } as React.CSSProperties,

  title: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--color-accent-cyan)',
  } as React.CSSProperties,

  content: {
    fontSize: '14px',
  } as React.CSSProperties,
}
