'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { api, handleApiError } from '@/services/api'
import { RankingEntry } from '@/types'
import RankingTable from '@/components/RankingTable'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function RankingsPage() {
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [total, setTotal] = useState(0)
  const [limit] = useState(50)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const handlePrev = () => setOffset(Math.max(0, offset - limit))
  const handleNext = () => {
    if (offset + limit < total) {
      setOffset(offset + limit)
    }
  }

  useEffect(() => {
    api
      .getRankings(limit, offset)
      .then((res) => {
        setRanking(res.data.data || [])
        setTotal(res.data.total || 0)
      })
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setLoading(false))
  }, [offset, limit])

  return (
    <div style={styles.container}>
      <div style={styles.containerBg} aria-hidden="true">
        <Image
          src="/assets/mascotas.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          style={styles.containerBgImage}
        />
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🏆 Ranking Global</h1>
        <p style={styles.subtitle}>Top {total} competidores en el Mundial</p>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {loading && <div style={styles.loading}>Cargando ranking...</div>}

        {!loading && !error && (
          <Card title="Posiciones Actuales">
            <RankingTable entries={ranking} />

            {/* Pagination */}
            <div style={styles.pagination}>
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrev}
                disabled={offset === 0}
              >
                ← Anterior
              </Button>

              <span style={styles.pageInfo}>
                {offset / limit + 1} de {Math.ceil(total / limit)}
              </span>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleNext}
                disabled={offset + limit >= total}
              >
                Siguiente →
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
    opacity: 0.22,
    pointerEvents: 'none',
    filter: 'saturate(1.05) contrast(1.02)',
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
    color: 'var(--color-accent-yellow)',
  } as React.CSSProperties,

  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-text-dim)',
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

  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid var(--color-divider)',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  pageInfo: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    minWidth: '80px',
    textAlign: 'center',
  } as React.CSSProperties,
}
