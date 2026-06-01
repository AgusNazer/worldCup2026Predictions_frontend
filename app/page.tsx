'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { api, handleApiError } from '@/services/api'
import { RankingEntry, Match } from '@/types'
import RankingTable from '@/components/RankingTable'
import MatchCard from '../components/MatchCard'
import Card from '@/components/Card'
import Button from '@/components/Button'
import useIsMobile from '@/components/useIsMobile'

export default function Home() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.getRankings(5).then((res) => setRanking(res.data.data || [])),
      api.getMatches('scheduled').then((res) => setMatches(res.data.slice(0, 5) || [])),
    ])
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setLoading(false))
  }, [])

  const handlePredict = (matchId: number) => {
    router.push(`/predictions/${matchId}`)
  }

  return (
    <div style={styles.container}>
      <div style={styles.backdropA} />
      <div style={styles.backdropB} />
      <div style={styles.contentBg} aria-hidden="true">
        <Image
          src="/assets/pelotas.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          style={styles.contentBgImage}
        />
      </div>

      <section style={{ ...styles.hero, ...(isMobile ? styles.heroMobile : {}) }}>
        <div style={{ ...styles.heroMedia, ...(isMobile ? styles.heroMediaMobile : {}) }}>
          <Image
            src="/assets/mundialPortada.jpg"
            alt="Portada World Cup Predictor"
            fill
            priority
            style={styles.heroImage}
          />
          <div style={styles.heroOverlay} />
          <div style={styles.heroGlowA} />
          <div style={styles.heroGlowB} />
          <div style={{ ...styles.heroCopy, ...(isMobile ? styles.heroCopyMobile : {}) }}>
            <div style={styles.heroTag}>Mundial 2026 • vive la fiesta</div>
            <h1 style={styles.heroTitle}>Predice. Compite. Domina.</h1>
            <p style={styles.heroSubtitle}>
              Anticipa los resultados del Mundial y escala la tabla de rankings
            </p>
            <div style={styles.heroCta}>
              <Button size="lg" onClick={() => router.push('/matches')}>
                Empezar a Predecir
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div style={styles.content}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {loading && <div style={styles.loading}>Cargando...</div>}

        <div style={{ ...styles.grid, ...(isMobile ? styles.gridMobile : {}) }}>
          <Card title="🏆 Top 5 Ranking">
            {ranking.length > 0 ? (
              <RankingTable entries={ranking} />
            ) : (
              <div style={styles.empty}>Sin datos</div>
            )}
            <div style={styles.cardFooter}>
              <Button variant="secondary" size="sm" onClick={() => router.push('/rankings')}>
                Ver ranking completo →
              </Button>
            </div>
          </Card>

          <Card title="⚽ Próximos Partidos">
            {matches.length > 0 ? (
              matches.map((match) => (
                <MatchCard key={match.id} match={match} onPredict={handlePredict} />
              ))
            ) : (
              <div style={styles.empty}>Sin partidos próximos</div>
            )}
          </Card>
        </div>
      </div>

    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  } as React.CSSProperties,

  backdropA: {
    position: 'absolute',
    inset: '80px auto auto -120px',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 231, 106, 0.25) 0%, rgba(255, 231, 106, 0.08) 40%, transparent 72%)',
    filter: 'blur(8px)',
    pointerEvents: 'none',
  } as React.CSSProperties,

  backdropB: {
    position: 'absolute',
    inset: '240px -140px auto auto',
    width: '360px',
    height: '360px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(74, 168, 255, 0.22) 0%, rgba(255, 43, 79, 0.08) 42%, transparent 75%)',
    filter: 'blur(10px)',
    pointerEvents: 'none',
  } as React.CSSProperties,

  hero: {
    padding: '16px 20px 0',
    borderBottom: '1px solid var(--color-border)',
    position: 'relative',
    zIndex: 2,
  } as React.CSSProperties,

  heroMobile: {
    padding: '12px 12px 0',
  } as React.CSSProperties,

  heroMedia: {
    position: 'relative',
    minHeight: '520px',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--color-border)',
    backgroundColor: '#000',
  } as React.CSSProperties,

  heroMediaMobile: {
    minHeight: '360px',
    borderRadius: 'var(--radius-lg)',
  } as React.CSSProperties,

  heroImage: {
    objectFit: 'cover',
    objectPosition: 'center',
  } as React.CSSProperties,

  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(180deg, rgba(6,6,10,0.1) 0%, rgba(6,6,10,0.24) 38%, rgba(6,6,10,0.72) 100%)',
  } as React.CSSProperties,

  heroGlowA: {
    position: 'absolute',
    inset: 'auto auto 26px 26px',
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 231, 106, 0.22) 0%, transparent 68%)',
    filter: 'blur(12px)',
  } as React.CSSProperties,

  heroGlowB: {
    position: 'absolute',
    inset: '34px 28px auto auto',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(74, 168, 255, 0.22) 0%, transparent 70%)',
    filter: 'blur(12px)',
  } as React.CSSProperties,

  heroCopy: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '32px',
    textAlign: 'center',
  } as React.CSSProperties,

  heroCopyMobile: {
    padding: '20px 14px',
  } as React.CSSProperties,

  heroTitle: {
    margin: '0 0 12px 0',
    fontSize: 'clamp(42px, 5vw, 62px)',
    fontWeight: 900,
    background: 'linear-gradient(90deg, var(--color-accent-yellow), var(--color-accent-pink) 45%, var(--color-accent-cyan) 78%, var(--color-accent-lime))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
  } as React.CSSProperties,

  heroTag: {
    marginBottom: '12px',
    padding: '8px 14px',
    borderRadius: '999px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: 'var(--color-text)',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    backdropFilter: 'blur(10px)',
  } as React.CSSProperties,

  heroSubtitle: {
    margin: '0 0 24px 0',
    fontSize: '17px',
    color: '#edf2ff',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textShadow: '0 6px 20px rgba(0, 0, 0, 0.45)',
  } as React.CSSProperties,

  heroCta: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  } as React.CSSProperties,

  content: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: '40px 20px',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  contentMobile: {
    padding: '24px 12px',
  } as React.CSSProperties,

  contentBg: {
    position: 'absolute',
    inset: 0,
    opacity: 0.09,
    pointerEvents: 'none',
    filter: 'saturate(0.9) contrast(1.02)',
  } as React.CSSProperties,

  contentBgImage: {
    objectFit: 'cover',
    objectPosition: 'center',
    mixBlendMode: 'screen',
  } as React.CSSProperties,

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  gridMobile: {
    gridTemplateColumns: '1fr',
    gap: '16px',
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
    zIndex: 2,
  } as React.CSSProperties,

  loading: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
    position: 'relative',
    zIndex: 2,
  } as React.CSSProperties,

  empty: {
    textAlign: 'center',
    padding: '20px',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
  } as React.CSSProperties,

  cardFooter: {
    marginTop: '12px',
  } as React.CSSProperties,

}
