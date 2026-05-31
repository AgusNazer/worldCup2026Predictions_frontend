'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'

export default function Navigation() {
  const isLoggedIn = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange)
      return () => window.removeEventListener('storage', onStoreChange)
    },
    () => !!localStorage.getItem('token'),
    () => false,
  )

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link href="/" style={styles.brand}>
          ⚽ Predictor
        </Link>
        
        <div style={styles.links}>
          <Link href="/matches" style={styles.link}>Partidos</Link>
          <Link href="/rankings" style={styles.link}>Ranking</Link>
          
          {isLoggedIn ? (
            <>
              <Link href="/my-predictions" style={styles.link}>Mis Predicciones</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>Salir</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={styles.linkAuth}>Ingresar</Link>
              <Link href="/auth/register" style={styles.linkRegister}>Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    padding: '12px 0',
  } as React.CSSProperties,
  
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,
  
  brand: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--color-accent-cyan)',
  } as React.CSSProperties,
  
  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  } as React.CSSProperties,
  
  link: {
    color: 'var(--color-text-dim)',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 150ms ease',
  } as React.CSSProperties,
  
  linkAuth: {
    color: 'var(--color-accent-cyan)',
    fontSize: '14px',
    fontWeight: 500,
  } as React.CSSProperties,
  
  linkRegister: {
    color: 'var(--color-text)',
    fontSize: '14px',
    fontWeight: 600,
    padding: '6px 12px',
    border: '1px solid var(--color-accent-pink)',
    borderRadius: 'var(--radius-sm)',
  } as React.CSSProperties,
  
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid var(--color-accent-pink)',
    color: 'var(--color-accent-pink)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    fontWeight: 500,
  } as React.CSSProperties,
}
