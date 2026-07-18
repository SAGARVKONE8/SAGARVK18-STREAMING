import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiX, FiFilter } from 'react-icons/fi'
import Navbar from '../../components/Navbar/Navbar'
import ContentCard from '../../components/ContentCard/ContentCard'
import SkeletonCard from '../../components/UI/SkeletonCard'
import { searchContent, getByType, getByGenre, getGenres, getAllContent } from '../../api/contentApi'

const TYPES = [
  { label: 'All',    value: '' },
  { label: '🎬 Movies', value: 'MOVIE' },
  { label: '📺 Series', value: 'SERIES' },
]

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [query,   setQuery]   = useState(searchParams.get('q') || '')
  const [type,    setType]    = useState(searchParams.get('type') || '')
  const [genre,   setGenre]   = useState('')
  const [results, setResults] = useState([])
  const [genres,  setGenres]  = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const debounceTimer = useRef(null)

  /* Load genre list */
  useEffect(() => {
    getGenres()
      .then((res) => setGenres(Array.isArray(res.data.data) ? res.data.data : []))
      .catch(() => {})
  }, [])

  /* Perform search */
  const doSearch = useCallback(async (q, t, g) => {
    setLoading(true)
    setSearched(true)
    try {
      let res
      if (q) {
        res = await searchContent(q)
      } else if (g) {
        res = await getByGenre(g)
      } else if (t) {
        res = await getByType(t)
      } else {
        res = await getAllContent(0, 40)
      }
      const d = res.data.data
      const list = Array.isArray(d) ? d : d?.content || []
      setResults(list)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  /* Debounce query changes */
  useEffect(() => {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      doSearch(query, type, genre)
      // Update URL params
      const params = {}
      if (query) params.q = query
      if (type)  params.type = type
      setSearchParams(params, { replace: true })
    }, 350)
    return () => clearTimeout(debounceTimer.current)
  }, [query, type, genre, doSearch])

  /* Load on mount if URL has initial type */
  useEffect(() => {
    const initType = searchParams.get('type') || ''
    if (initType) setType(initType)
    doSearch(query, initType, genre)
  }, []) // eslint-disable-line

  const clearSearch = () => {
    setQuery('')
    setGenre('')
    setType('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080810' }}>
      <Navbar />

      <div style={{ padding: '100px 4vw 60px' }}>
        {/* ── Search heading ── */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 800,
            fontSize: 'clamp(24px, 4vw, 40px)',
            color: '#fff', marginBottom: '32px',
          }}
        >
          Search & Discover
        </motion.h1>

        {/* ── Search input ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ position: 'relative', maxWidth: '700px', marginBottom: '28px' }}
        >
          <FiSearch size={22} style={{
            position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)',
            color: '#666680', pointerEvents: 'none',
          }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, series, genres..."
            autoFocus
            className="liquid-input"
            style={{
              borderRadius: '20px',
              fontSize: '17px',
              padding: '18px 50px 18px 54px',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
          {query && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={clearSearch}
              style={{
                position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '50%',
                width: '30px', height: '30px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#b3b3cc', cursor: 'pointer',
              }}
            >
              <FiX size={16} />
            </motion.button>
          )}
        </motion.div>

        {/* ── Type filter chips ── */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {TYPES.map((t) => (
            <motion.button
              key={t.value}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setType(t.value)}
              className="liquid-badge"
              style={{
                background: type === t.value
                  ? 'linear-gradient(135deg, var(--accent-red), #ff2d3a)'
                  : 'rgba(255,255,255,0.04)',
                color: type === t.value ? '#fff' : '#a0a0c0',
                borderColor: type === t.value
                  ? 'rgba(229,9,20,0.4)'
                  : 'rgba(255,255,255,0.08)',
                padding: '8px 22px',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: type === t.value
                  ? '0 4px 24px rgba(229,9,20,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {t.label}
            </motion.button>
          ))}
        </div>

        {/* ── Genre chips ── */}
        {genres.length > 0 && (
          <div className="chips-scrollable">
            <button
              onClick={() => setGenre('')}
              className="liquid-badge"
              style={{
                background: genre === '' ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.03)',
                color: genre === '' ? '#f5a623' : '#5a5a80',
                borderColor: genre === '' ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.06)',
                padding: '6px 16px',
                fontSize: '13px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
            >All Genres</button>
            {genres.slice(0, 20).map((g) => (
              <button
                key={g.id || g.name}
                onClick={() => setGenre(genre === g.name ? '' : g.name)}
                className="liquid-badge"
                style={{
                  background: genre === g.name ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.03)',
                  color: genre === g.name ? '#f5a623' : '#a0a0c0',
                  borderColor: genre === g.name ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.06)',
                  padding: '6px 14px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.35s var(--ease-liquid)',
                }}
              >{g.name || g}</button>
            ))}
          </div>
        )}

        {/* ── Results ── */}
        {loading ? (
          <div className="responsive-grid">
            <SkeletonCard count={12} width="100%" />
          </div>
        ) : results.length > 0 ? (
          <>
            <p style={{
              color: '#666680', fontFamily: 'Inter, sans-serif',
              fontSize: '14px', marginBottom: '20px',
            }}>
              {results.length} title{results.length !== 1 ? 's' : ''} found
              {query && ` for "${query}"`}
            </p>
            <motion.div className="responsive-grid">
              <AnimatePresence>
                {results.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: Math.min(i * 0.035, 0.5) }}
                  >
                    <ContentCard content={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : searched ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              paddingTop: '80px', gap: '20px', textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '72px', opacity: 0.4 }}>🎬</span>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700,
              fontSize: '24px', color: '#fff',
            }}>No results found</h2>
            <p style={{
              color: '#666680', fontFamily: 'Inter, sans-serif',
              fontSize: '15px', maxWidth: '380px', lineHeight: 1.6,
            }}>
              {query
                ? `We couldn't find anything matching "${query}". Try a different search.`
                : 'No content available for the selected filters.'}
            </p>
            <button
              onClick={clearSearch}
              style={{
                background: '#e50914', color: '#fff',
                border: 'none', borderRadius: '12px',
                padding: '12px 28px', fontSize: '15px',
                fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
              }}
            >Clear Filters</button>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}

export default SearchPage
