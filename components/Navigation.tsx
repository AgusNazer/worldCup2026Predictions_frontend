'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import useIsMobile from '@/components/useIsMobile'

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem('token'))

    syncAuth()
    window.addEventListener('storage', syncAuth)
    window.addEventListener('authchange', syncAuth)

    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('authchange', syncAuth)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.dispatchEvent(new Event('authchange'))
    setMenuOpen(false)
    window.location.href = '/'
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link href="/" style={styles.brand}>
          ⚽ Predictor
        </Link>

        {isMobile ? (
          <>
            <button
              type="button"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              style={styles.menuBtn}
            >
              <span style={styles.menuIcon} />
              <span style={styles.menuIcon} />
              <span style={styles.menuIcon} />
            </button>

            {menuOpen && (
              <div style={styles.mobileMenu}>
                <Link href="/matches" style={styles.mobileLink} onClick={closeMenu}>Partidos</Link>
                <Link href="/rankings" style={styles.mobileLink} onClick={closeMenu}>Ranking</Link>
                {isLoggedIn ? (
                  <>
                    <Link href="/my-predictions" style={styles.mobileLink} onClick={closeMenu}>
                      Mis Predicciones
                    </Link>
                    <button onClick={handleLogout} style={styles.mobileLogoutBtn}>Salir</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" style={styles.mobileLink} onClick={closeMenu}>
                      Ingresar
                    </Link>
                    <Link href="/auth/register" style={styles.mobileLinkStrong} onClick={closeMenu}>
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
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
        )}
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
    gap: '12px',
    position: 'relative',
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

  menuBtn: {
    width: '42px',
    height: '42px',
    display: 'inline-flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    background: 'var(--color-surface-light)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: 0,
  } as React.CSSProperties,

  menuIcon: {
    width: '18px',
    height: '2px',
    borderRadius: '999px',
    background: 'var(--color-text)',
    display: 'block',
  } as React.CSSProperties,

  mobileMenu: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: '20px',
    width: 'min(280px, calc(100vw - 32px))',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '14px',
    borderRadius: 'var(--radius-lg)',
    background: 'rgba(15, 17, 23, 0.98)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 30,
  } as React.CSSProperties,

  mobileLink: {
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-surface-light)',
    color: 'var(--color-text)',
    fontSize: '14px',
    fontWeight: 600,
  } as React.CSSProperties,

  mobileLinkStrong: {
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'linear-gradient(90deg, var(--color-accent-pink), var(--color-accent-cyan))',
    color: '#000',
    fontSize: '14px',
    fontWeight: 800,
  } as React.CSSProperties,

  mobileLogoutBtn: {
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    border: '1px solid var(--color-accent-pink)',
    color: 'var(--color-accent-pink)',
    fontSize: '14px',
    fontWeight: 700,
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
