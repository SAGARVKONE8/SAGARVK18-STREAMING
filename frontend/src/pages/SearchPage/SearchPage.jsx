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
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
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
            style={{
              width: '100%',
              background: 'rgba(26,26,46,0.8)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: '18px', color: '#fff',
              fontSize: '17px', fontFamily: 'Outfit, sans-serif',
              padding: '18px 50px 18px 54px',
              outline: 'none', transition: 'border-color 0.25s',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#e50914')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
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
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {TYPES.map((t) => (
            <motion.button
              key={t.value}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setType(t.value)}
              style={{
                background: type === t.value
                  ? '#e50914'
                  : 'rgba(26,26,46,0.8)',
                color: type === t.value ? '#fff' : '#b3b3cc',
                border: type === t.value
                  ? '1.5px solid #e50914'
                  : '1.5px solid rgba(255,255,255,0.1)',
                borderRadius: '24px', padding: '8px 20px',
                fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                fontSize: '14px', cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: type === t.value ? '0 0 16px rgba(229,9,20,0.3)' : 'none',
              }}
            >
              {t.label}
            </motion.button>
          ))}
        </div>

        {/* ── Genre chips ── */}
        {genres.length > 0 && (
          <div style={{
            display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px',
          }}>
            <button
              onClick={() => setGenre('')}
              style={{
                background: genre === '' ? 'rgba(245,166,35,0.2)' : 'transparent',
                color: genre === '' ? '#f5a623' : '#666680',
                border: genre === '' ? '1px solid rgba(245,166,35,0.4)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px', padding: '6px 16px',
                fontFamily: 'Inter, sans-serif', fontSize: '13px',
                cursor: 'pointer', fontWeight: genre === '' ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >All Genres</button>
            {genres.slice(0, 20).map((g) => (
              <button
                key={g.id || g.name}
                onClick={() => setGenre(genre === g.name ? '' : g.name)}
                style={{
                  background: genre === g.name ? 'rgba(245,166,35,0.18)' : 'transparent',
                  color: genre === g.name ? '#f5a623' : '#666680',
                  border: genre === g.name ? '1px solid rgba(245,166,35,0.35)' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '20px', padding: '6px 14px',
                  fontFamily: 'Inter, sans-serif', fontSize: '13px',
                  cursor: 'pointer', fontWeight: genre === g.name ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >{g.name || g}</button>
            ))}
          </div>
        )}

        {/* ── Results ── */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
            gap: '16px',
          }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} width={175} />
            ))}
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
            <motion.div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
                gap: '16px',
              }}
            >
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
