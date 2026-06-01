'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api, handleApiError } from '@/services/api'
import { Match } from '@/types'
import Card from '@/components/Card'
import Button from '@/components/Button'
import useIsMobile from '@/components/useIsMobile'

export default function PredictionPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const params = useParams<{ matchId: string }>()
  const matchId = Number(params.matchId)
  const isValidMatchId = Number.isFinite(matchId)

  const [match, setMatch] = useState<Match | null>(null)
  const [predA, setPredA] = useState(2)
  const [predB, setPredB] = useState(1)
  const [loading, setLoading] = useState(isValidMatchId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isValidMatchId) return

    api
      .getMatch(matchId)
      .then((res) => {
        setMatch(res.data)
      })
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setLoading(false))
  }, [isValidMatchId, matchId])

  const handleSave = async () => {
    if (!Number.isFinite(matchId)) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await api.createPrediction(matchId, predA, predB)
      setSuccess('Predicción guardada')
      router.push('/my-predictions')
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Predecir Partido</h1>
        <p style={styles.subtitle}>Escribe el marcador estimado y guarda tu predicción</p>
      </div>

      <div style={styles.content}>
        {!isValidMatchId && <div style={styles.errorBox}>Partido inválido</div>}
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}
        {loading && <div style={styles.loading}>Cargando partido...</div>}

        {!loading && match && (
          <Card title={`${match.team_a} vs ${match.team_b}`}>
            <div style={styles.matchMeta}>
              <span style={styles.metaItem}>Estado: {match.status}</span>
              <span style={styles.metaItem}>
                {new Date(match.match_date).toLocaleString('es-ES', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>

            <div style={{ ...styles.form, ...(isMobile ? styles.formMobile : {}) }}>
              <div style={styles.teamBlock}>
                <label style={styles.label}>{match.team_a}</label>
                <input
                  type="number"
                  min={0}
                  value={predA}
                  onChange={(e) => setPredA(Number(e.target.value))}
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.vs, ...(isMobile ? styles.vsMobile : {}) }}>VS</div>

              <div style={styles.teamBlock}>
                <label style={styles.label}>{match.team_b}</label>
                <input
                  type="number"
                  min={0}
                  value={predB}
                  onChange={(e) => setPredB(Number(e.target.value))}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.preview}>
              <strong>
                {match.team_a} [{predA}] {match.team_b} [{predB}]
              </strong>
            </div>

            <div style={{ ...styles.actions, ...(isMobile ? styles.actionsMobile : {}) }}>
              <Button variant="secondary" onClick={() => router.push('/matches')}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar predicción'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg)',
  } as React.CSSProperties,

  header: {
    padding: '40px 20px',
    textAlign: 'center',
    borderBottom: '1px solid var(--color-border)',
  } as React.CSSProperties,

  title: {
    margin: '0 0 8px 0',
    fontSize: '32px',
    fontWeight: 900,
    color: 'var(--color-accent-pink)',
  } as React.CSSProperties,

  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-text-dim)',
  } as React.CSSProperties,

  content: {
    flex: 1,
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
    padding: '40px 20px',
  } as React.CSSProperties,

  contentMobile: {
    padding: '24px 16px',
  } as React.CSSProperties,

  errorBox: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    border: '1px solid var(--color-accent-pink)',
    color: 'var(--color-accent-pink)',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '20px',
    fontSize: '14px',
  } as React.CSSProperties,

  successBox: {
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    border: '1px solid var(--color-accent-lime)',
    color: 'var(--color-accent-lime)',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '20px',
    fontSize: '14px',
  } as React.CSSProperties,

  loading: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
  } as React.CSSProperties,

  matchMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    color: 'var(--color-text-muted)',
    fontSize: '13px',
  } as React.CSSProperties,

  metaItem: {
    padding: '6px 10px',
    backgroundColor: 'var(--color-surface-light)',
    borderRadius: 'var(--radius-sm)',
  } as React.CSSProperties,

  form: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '16px',
    alignItems: 'end',
  } as React.CSSProperties,

  formMobile: {
    gridTemplateColumns: '1fr',
  } as React.CSSProperties,

  teamBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  } as React.CSSProperties,

  label: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-text)',
  } as React.CSSProperties,

  input: {
    width: '100%',
    backgroundColor: 'var(--color-surface-light)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text)',
    fontSize: '20px',
    fontWeight: 800,
    padding: '16px',
    textAlign: 'center',
  } as React.CSSProperties,

  vs: {
    alignSelf: 'center',
    color: 'var(--color-text-muted)',
    fontWeight: 800,
  } as React.CSSProperties,

  vsMobile: {
    justifySelf: 'center',
    margin: '4px 0',
  } as React.CSSProperties,

  preview: {
    marginTop: '24px',
    padding: '14px',
    backgroundColor: 'rgba(0, 217, 255, 0.08)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
    color: 'var(--color-accent-cyan)',
  } as React.CSSProperties,

  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    marginTop: '24px',
  } as React.CSSProperties,

  actionsMobile: {
    flexDirection: 'column',
  } as React.CSSProperties,
}
