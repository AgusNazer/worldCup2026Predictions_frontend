'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { api, handleApiError } from '@/services/api'
import { Match, Prediction } from '@/types'
import Card from '@/components/Card'
import Button from '@/components/Button'

type PredictionWithMatch = {
  prediction: Prediction
  match?: Match
}

export default function MyPredictionsPage() {
  const router = useRouter()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [matchesById, setMatchesById] = useState<Record<number, Match>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getMyPredictions()
      .then(async (res) => {
        const predictionList = res.data || []
        setPredictions(predictionList)

        const uniqueMatchIds = Array.from(new Set(predictionList.map((prediction) => prediction.match_id)))
        const results = await Promise.allSettled(uniqueMatchIds.map((matchId) => api.getMatch(matchId)))
        const nextMatches: Record<number, Match> = {}

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            nextMatches[uniqueMatchIds[index]] = result.value.data
          }
        })

        setMatchesById(nextMatches)
      })
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setLoading(false))
  }, [])

  const items = useMemo<PredictionWithMatch[]>(() => {
    return predictions.map((prediction) => ({
      prediction,
      match: matchesById[prediction.match_id],
    }))
  }, [matchesById, predictions])

  const totalPoints = predictions.reduce((sum, prediction) => sum + prediction.points_earned, 0)

  return (
    <div style={styles.container}>
      <div style={styles.containerBg} aria-hidden="true">
        <Image
          src="/assets/yamal.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          style={styles.containerBgImage}
        />
      </div>

      <div style={styles.header}>
        <h1 style={styles.title}>Mis Predicciones</h1>
        <p style={styles.subtitle}>
          Total de puntos: <span style={styles.points}>{totalPoints}</span>
        </p>
      </div>

      <div style={styles.content}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {loading && <div style={styles.loading}>Cargando predicciones...</div>}

        {!loading && !error && (
          <Card title={`${predictions.length} Predicciones`}>
            {items.length > 0 ? (
              <div style={styles.list}>
                {items.map(({ prediction, match }) => {
                  const matchLabel = match ? `${match.team_a} vs ${match.team_b}` : `Partido #${prediction.match_id}`
                  const statusLabel = match?.status === 'finished' ? 'finalizado' : 'pendiente'

                  return (
                    <div key={prediction.id} style={styles.predItem}>
                      <div style={styles.predMain}>
                        <div style={styles.predHeader}>
                          <span style={styles.matchName}>{matchLabel}</span>
                          <span style={styles.date}>
                            {new Date(prediction.prediction_date).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <div style={styles.predResult}>
                          <span style={styles.scoreBadge}>
                            {match?.team_a ?? 'Equipo A'} {prediction.pred_a} - {prediction.pred_b} {match?.team_b ?? 'Equipo B'}
                          </span>
                          <span style={styles.status}>Estado: {statusLabel}</span>
                        </div>
                      </div>
                      <div style={styles.pointsBox}>Puntos: {prediction.points_earned}</div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={styles.empty}>Aún no tienes predicciones</div>
            )}

            <div style={styles.cardFooter}>
              <Button variant="secondary" size="sm" onClick={() => router.push('/matches')}>
                ← Volver a Partidos
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
    position: 'relative',
    overflow: 'hidden',
  } as React.CSSProperties,

  containerBg: {
    position: 'absolute',
    inset: 0,
    opacity: 0.18,
    pointerEvents: 'none',
    filter: 'saturate(1.08) contrast(1.03)',
  } as React.CSSProperties,

  containerBgImage: {
    objectFit: 'cover',
    objectPosition: 'center',
    mixBlendMode: 'screen',
  } as React.CSSProperties,

  header: {
    padding: '40px 20px',
    textAlign: 'center',
    borderBottom: '1px solid var(--color-border)',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  title: {
    margin: '0 0 8px 0',
    fontSize: '32px',
    fontWeight: 900,
    color: 'var(--color-accent-cyan)',
  } as React.CSSProperties,

  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-text-dim)',
  } as React.CSSProperties,

  points: {
    color: 'var(--color-accent-pink)',
    fontWeight: 800,
  } as React.CSSProperties,

  content: {
    flex: 1,
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
    padding: '40px 20px',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  errorBox: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    border: '1px solid var(--color-accent-pink)',
    color: 'var(--color-accent-pink)',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '20px',
    fontSize: '14px',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  loading: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  predItem: {
    backgroundColor: 'var(--color-surface-light)',
    border: '1px solid var(--color-border)',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  } as React.CSSProperties,

  predMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  } as React.CSSProperties,

  predHeader: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  } as React.CSSProperties,

  matchName: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-text)',
  } as React.CSSProperties,

  date: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  } as React.CSSProperties,

  predResult: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  } as React.CSSProperties,

  scoreBadge: {
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    color: 'var(--color-accent-cyan)',
    padding: '4px 8px',
    borderRadius: 'var(--radius-xs)',
    fontSize: '13px',
    fontWeight: 700,
  } as React.CSSProperties,

  status: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  } as React.CSSProperties,

  pointsBox: {
    minWidth: '90px',
    textAlign: 'right',
    color: 'var(--color-accent-pink)',
    fontWeight: 800,
  } as React.CSSProperties,

  empty: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  cardFooter: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid var(--color-divider)',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,
}
