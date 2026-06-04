'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { api, handleApiError } from '@/services/api'
import { Match } from '@/types'
import MatchCard from '../../components/MatchCard'
import Card from '@/components/Card'
import useIsMobile from '@/components/useIsMobile'

export default function MatchesPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [matches, setMatches] = useState<Match[]>([])
  const [filter, setFilter] = useState<string | undefined>('scheduled')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const itemsPerPage = 6
  const totalPages = Math.ceil(matches.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const paginatedMatches = matches.slice(startIdx, endIdx)

  const handleFilterChange = (newFilter: string | undefined) => {
    setLoading(true)
    setFilter(newFilter)
    setCurrentPage(1)
    setSearchQuery('')
    setIsSearching(false)
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setIsSearching(false)
      return
    }
    
    setLoading(true)
    setIsSearching(true)
    setCurrentPage(1)
    
    api
      .searchMatches({ q: searchQuery })
      .then((res) => {
        if (!Array.isArray(res.data)) {
          setError(typeof res.data === 'string' ? res.data : JSON.stringify(res.data))
          setMatches([])
        } else {
          setMatches(res.data || [])
        }
      })
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setLoading(false))
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setIsSearching(false)
    setCurrentPage(1)
    setLoading(true)
    api
      .getMatches(filter)
      .then((res) => {
        if (!Array.isArray(res.data)) {
          setError(typeof res.data === 'string' ? res.data : JSON.stringify(res.data))
          setMatches([])
        } else {
          setMatches(res.data || [])
        }
      })
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    api
      .getMatches(filter)
      .then((res) => {
        if (!Array.isArray(res.data)) {
          setError(typeof res.data === 'string' ? res.data : JSON.stringify(res.data))
          setMatches([])
        } else {
          setMatches(res.data || [])
        }
      })
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setLoading(false))
  }, [filter])

  const handlePredict = (matchId: number) => {
    router.push(`/predictions/${matchId}`)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const filterOptions = [
    { value: 'scheduled', label: 'Próximos' },
    { value: 'ongoing', label: 'En Vivo' },
    { value: 'finished', label: 'Finalizados' },
  ]

  return (
    <div style={styles.container}>
      <div style={styles.containerBg} aria-hidden="true">
        <Image
          src="/assets/messiChamp.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          style={styles.containerBgImage}
        />
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>⚽ Partidos del Mundial</h1>
        <p style={styles.subtitle}>Predice los resultados y gana puntos</p>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            style={getFilterButtonStyle(opt.value === filter)}
            onClick={() => handleFilterChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div style={styles.searchBar}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Busca por equipo o ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={styles.searchInput}
          />
          <button
            onClick={handleSearch}
            style={styles.searchButton}
            disabled={loading}
          >
            Buscar
          </button>
          {isSearching && (
            <button
              onClick={handleClearSearch}
              style={styles.clearButton}
            >
              ✕ Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {loading && <div style={styles.loading}>Cargando partidos...</div>}

        {!loading && !error && (
          <>
            <Card title={`${matches.length} Partidos (Página ${currentPage} de ${totalPages || 1})`} style={{ position: 'relative', zIndex: 1 }}>
              {paginatedMatches.length > 0 ? (
                paginatedMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onPredict={handlePredict}
                  />
                ))
              ) : (
                <div style={styles.empty}>Sin partidos en este estado</div>
              )}
            </Card>

            {totalPages > 1 && (
              <div style={{ ...styles.pagination, ...(isMobile ? styles.paginationMobile : {}) }}>
                <button
                  style={getPaginationButtonStyle(currentPage === 1)}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>
                <span style={styles.pageInfo}>{currentPage} de {totalPages}</span>
                <button
                  style={getPaginationButtonStyle(currentPage === totalPages)}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function getFilterButtonStyle(active: boolean): React.CSSProperties {
  return {
    padding: '8px 16px',
    border: active ? '2px solid var(--color-accent-cyan)' : '1px solid var(--color-border)',
    backgroundColor: active ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
    color: active ? 'var(--color-accent-cyan)' : 'var(--color-text-muted)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 150ms ease',
  }
}

function getPaginationButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    backgroundColor: disabled ? 'rgba(255, 255, 255, 0.04)' : 'var(--color-surface)',
    color: disabled ? 'var(--color-text-muted)' : 'var(--color-text)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 150ms ease',
    opacity: disabled ? 0.5 : 1,
  }
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
    opacity: 0.25,
    pointerEvents: 'none',
    filter: 'saturate(1.1) contrast(1.05)',
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
    color: 'var(--color-accent-lime)',
  } as React.CSSProperties,

  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-text-dim)',
  } as React.CSSProperties,

  filterBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    padding: '20px',
    borderBottom: '1px solid var(--color-divider)',
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 1,
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

  empty: {
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
    marginTop: '24px',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  paginationMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  } as React.CSSProperties,

  pageInfo: {
    fontSize: '13px',
    color: 'var(--color-text-dim)',
    fontWeight: 500,
  } as React.CSSProperties,

  searchBar: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--color-divider)',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  searchContainer: {
    display: 'flex',
    gap: '8px',
    maxWidth: '900px',
    margin: '0 auto',
  } as React.CSSProperties,

  searchInput: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 200ms ease',
  } as React.CSSProperties,

  searchButton: {
    padding: '10px 20px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    color: 'var(--color-accent-cyan)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 150ms ease',
  } as React.CSSProperties,

  clearButton: {
    padding: '10px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    color: 'var(--color-accent-pink)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 150ms ease',
  } as React.CSSProperties,
}
