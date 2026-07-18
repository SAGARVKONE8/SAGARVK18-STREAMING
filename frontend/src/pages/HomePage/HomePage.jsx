import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar/Navbar'
import HeroBanner from '../../components/HeroBanner/HeroBanner'
import ContentRow from '../../components/ContentRow/ContentRow'
import { SkeletonRow } from '../../components/UI/SkeletonCard'
import {
  getTrending, getNewReleases, getTopRated, getByType
} from '../../api/contentApi'

const HomePage = () => {
  const [trending,  setTrending]  = useState([])
  const [newRel,    setNewRel]    = useState([])
  const [topRated,  setTopRated]  = useState([])
  const [movies,    setMovies]    = useState([])
  const [series,    setSeries]    = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, n, r, m, s] = await Promise.allSettled([
          getTrending(),
          getNewReleases(),
          getTopRated(),
          getByType('MOVIE'),
          getByType('SERIES'),
        ])

        const extractData = (result) => {
          if (result.status !== 'fulfilled') return []
          const d = result.value.data.data
          return Array.isArray(d) ? d : d?.content || []
        }

        setTrending(extractData(t))
        setNewRel(extractData(n))
        setTopRated(extractData(r))
        setMovies(extractData(m))
        setSeries(extractData(s))
      } catch (err) {
        console.error('Failed to load home data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />

      {/* Hero Banner */}
      {loading ? (
        <div
          className="hero-banner-responsive"
          style={{
            background: 'linear-gradient(90deg, #1a1a2e 0%, #242438 50%, #1a1a2e 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.6s infinite',
          }}
        >
          <style>{'@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }'}</style>
        </div>
      ) : (
        <HeroBanner contents={trending.slice(0, 6)} />
      )}

      {/* Content rows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ paddingTop: '32px' }}
      >
        {loading ? (
          <>
            <SkeletonRow count={7} />
            <SkeletonRow count={7} />
            <SkeletonRow count={7} />
          </>
        ) : (
          <>
            <ContentRow
              title="🔥 Trending Now"
              contents={trending}
              showAllLink="/search"
            />
            <ContentRow
              title="🆕 New Releases"
              contents={newRel}
              showAllLink="/search?sort=new"
            />
            <ContentRow
              title="⭐ Top Rated"
              contents={topRated}
              showAllLink="/search?sort=top"
            />
            <ContentRow
              title="🎬 Movies"
              contents={movies}
              showAllLink="/search?type=MOVIE"
            />
            <ContentRow
              title="📺 Series"
              contents={series}
              showAllLink="/search?type=SERIES"
            />
          </>
        )}
      </motion.div>

      {/* Bottom spacing */}
      <div style={{ height: '60px' }} />
    </div>
  )
}

export default HomePage
