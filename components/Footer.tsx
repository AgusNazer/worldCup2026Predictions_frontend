'use client'

import Link from 'next/link'
import useIsMobile from '@/components/useIsMobile'

function LinkedInSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4" {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0.2 8h4.6v15.2H0.2V8zM8.2 8h4.4v2.1h.1c.6-1.1 2.1-2.4 4.3-2.4 4.6 0 5.5 3 5.5 6.9v8.6h-4.6v-7.6c0-1.8 0-4.1-2.5-4.1s-2.9 1.9-2.9 3.9v7.8H8.2V8z" />
    </svg>
  )
}

function GithubSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.38-3.37-1.38-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1.01.07 1.54 1.06 1.54 1.06.9 1.59 2.36 1.13 2.94.87.09-.66.35-1.13.64-1.39-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.38-2.02 1.01-2.73-.1-.27-.44-1.36.1-2.83 0 0 .83-.27 2.7 1.04.78-.22 1.62-.33 2.46-.33.84 0 1.68.11 2.46.33 1.87-1.31 2.7-1.04 2.7-1.04.54 1.47.2 2.56.1 2.83.63.71 1.01 1.62 1.01 2.73 0 3.92-2.34 4.77-4.57 5.02.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .26.18.58.69.48C19.13 20.65 22 16.8 22 12.26 22 6.58 17.52 2 12 2z" />
    </svg>
  )
}

export default function Footer() {
  const isMobile = useIsMobile()

  return (
    <footer style={styles.footer}>
      <div style={{ ...styles.container, ...(isMobile ? styles.containerMobile : {}) }}>
        <div>
          <h3 style={styles.brand}>World Cup Predictor</h3>
          <p style={styles.text}>
            Predice partidos, compite en el ranking y sigue tu progreso en el Mundial 2026.
          </p>
          <p style={styles.copy}>© 2026 World Cup Predictor</p>
        </div>

        <div style={{ ...styles.linksGrid, ...(isMobile ? styles.linksGridMobile : {}) }}>
          <div>
            <h4 style={styles.heading}>Navegación</h4>
            <ul style={styles.list}>
              <li><Link href="/matches" style={styles.link}>Partidos</Link></li>
              <li><Link href="/rankings" style={styles.link}>Ranking</Link></li>
              <li><Link href="/my-predictions" style={styles.link}>Mis Predicciones</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={styles.heading}>Cuenta</h4>
            <ul style={styles.list}>
              <li><Link href="/auth/login" style={styles.link}>Ingresar</Link></li>
              <li><Link href="/auth/register" style={styles.link}>Registrarse</Link></li>
            </ul>
          </div>
        </div>

        <div style={{ ...styles.socialCol, ...(isMobile ? styles.socialColMobile : {}) }}>
          <div style={{ ...styles.socialRow, ...(isMobile ? styles.socialRowMobile : {}) }}>
            <a href="/rankings" style={styles.socialBtn} aria-label="Ranking">
              <span style={styles.socialInitial}>R</span>
            </a>
            <a href="/matches" style={styles.socialBtn} aria-label="Matches">
              <span style={styles.socialInitial}>M</span>
            </a>
            <a href="/my-predictions" style={styles.socialBtn} aria-label="Predictions">
              <span style={styles.socialInitial}>P</span>
            </a>
          </div>

          <div style={{ ...styles.socialRow, ...(isMobile ? styles.socialRowMobile : {}) }}>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              style={styles.iconBtn}
              aria-label="LinkedIn"
            >
              <LinkedInSVG />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              style={styles.iconBtn}
              aria-label="GitHub"
            >
              <GithubSVG />
            </a>

            <a href="mailto:contacto@worldcuppredictor.com" style={styles.emailBtn}>
              Contacto
            </a>
          </div>

          <p style={styles.helper}>
            ¿Necesitas ayuda? Revisa las secciones anteriores o entra a tu cuenta.
          </p>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    width: '100%',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    padding: '32px 0',
  } as React.CSSProperties,

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 1fr',
    gap: '28px',
    alignItems: 'start',
  } as React.CSSProperties,

  containerMobile: {
    gridTemplateColumns: '1fr',
    gap: '20px',
  } as React.CSSProperties,

  brand: {
    fontSize: '18px',
    fontWeight: 800,
    color: 'var(--color-accent-cyan)',
    marginBottom: '10px',
  } as React.CSSProperties,

  text: {
    fontSize: '14px',
    color: 'var(--color-text-dim)',
    maxWidth: '320px',
    lineHeight: 1.7,
  } as React.CSSProperties,

  copy: {
    marginTop: '14px',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  } as React.CSSProperties,

  linksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '24px',
  } as React.CSSProperties,

  linksGridMobile: {
    gridTemplateColumns: '1fr',
    gap: '18px',
  } as React.CSSProperties,

  heading: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '12px',
  } as React.CSSProperties,

  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  } as React.CSSProperties,

  link: {
    color: 'var(--color-text-dim)',
    fontSize: '14px',
    transition: 'color 150ms ease',
  } as React.CSSProperties,

  socialCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    alignItems: 'flex-start',
  } as React.CSSProperties,

  socialColMobile: {
    alignItems: 'stretch',
  } as React.CSSProperties,

  socialRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    alignItems: 'center',
  } as React.CSSProperties,

  socialRowMobile: {
    justifyContent: 'flex-start',
  } as React.CSSProperties,

  socialBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '999px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface-light)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text)',
  } as React.CSSProperties,

  socialInitial: {
    fontSize: '12px',
    fontWeight: 800,
    color: 'var(--color-accent-cyan)',
  } as React.CSSProperties,

  iconBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '999px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface-light)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-dim)',
  } as React.CSSProperties,

  emailBtn: {
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, var(--color-accent-pink), var(--color-accent-cyan))',
    color: '#000',
    fontSize: '13px',
    fontWeight: 700,
  } as React.CSSProperties,

  helper: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: 1.6,
  } as React.CSSProperties,
}