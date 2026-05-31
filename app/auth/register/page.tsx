'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, handleApiError } from '@/services/api'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      await api.register({ username, email, password })
      // Auto-login after registration
      await api.login({ email, password })
      router.push('/rankings')
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.centered}>
        <Card title="Crear Cuenta">
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.field}>
              <label style={styles.label}>Nombre de Usuario</label>
              <input
                type="text"
                placeholder="mi_usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Confirmar Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              style={{ width: '100%', ...(!loading ? {} : { opacity: 0.5 }) }}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>

            <div style={styles.footer}>
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" style={styles.link}>
                Ingresar
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 60px)',
    padding: '20px',
  } as React.CSSProperties,

  centered: {
    width: '100%',
    maxWidth: '400px',
  } as React.CSSProperties,

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  } as any,

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  } as any,

  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text-dim)',
  } as React.CSSProperties,

  input: {
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
  } as React.CSSProperties,

  errorBox: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    border: '1px solid var(--color-accent-pink)',
    color: 'var(--color-accent-pink)',
    padding: '12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
  } as React.CSSProperties,

  footer: {
    fontSize: '13px',
    color: 'var(--color-text-dim)',
    textAlign: 'center',
  } as React.CSSProperties,

  link: {
    color: 'var(--color-accent-cyan)',
    fontWeight: 600,
  } as React.CSSProperties,
}
