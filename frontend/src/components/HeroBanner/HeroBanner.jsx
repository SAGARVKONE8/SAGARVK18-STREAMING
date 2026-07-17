import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlay, FiPlus, FiInfo, FiStar, FiClock, FiCheck } from 'react-icons/fi'
import { addToWatchlist, removeFromWatchlist, checkWatchlist } from '../../api/watchlistApi'
import { useProfile } from '../../context/ProfileContext'
import toast from 'react-hot-toast'

const HeroBanner = ({ contents = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inWatchlist, setInWatchlist]   = useState(false)
  const { selectedProfile }             = useProfile()
  const navigate                        = useNavigate()

  const content = contents[currentIndex]

  /* Auto-cycle every 8 s */
  useEffect(() => {
    if (contents.length < 2) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(contents.length, 6))
    }, 8000)
    return () => clearInterval(timer)
  }, [contents.length])

  /* Check watchlist status when content or profile changes */
  useEffect(() => {
    if (!content || !selectedProfile) return
    checkWatchlist(selectedProfile.id, content.id)
      .then((res) => setInWatchlist(!!res.data.data))
      .catch(() => {})
  }, [content?.id, selectedProfile?.id])

  const handleWatchlist = async () => {
    if (!selectedProfile || !content) {
      toast.error('Please select a profile first')
      return
    }
    try {
      if (inWatchlist) {
        await removeFromWatchlist(selectedProfile.id, content.id)
        setInWatchlist(false)
        toast.success('Removed from My List')
      } else {
        await addToWatchlist(selectedProfile.id, content.id)
        setInWatchlist(true)
        toast.success('Added to My List! 🎬')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  if (!content) {
    return (
      <div style={{
        width: '100%', height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      }} />
    )
  }

  const backdropUrl =
    content.backdropUrl ||
    content.posterUrl   ||
    `https://picsum.photos/seed/${content.id}/1920/1080`

  return (
    <div style={{
      position: 'relative', width: '100%',
      height: 'min(100vh, 850px)',
      minHeight: '600px',
      overflow: 'hidden',
    }}>
      {/* ── Backdrop image ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${content.id}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
          }}
        />
      </AnimatePresence>

      {/* ── Gradient overlays ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(10,10,15,0.97) 0%, rgba(10,10,15,0.65) 45%, rgba(10,10,15,0.1) 70%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.35) 30%, transparent 60%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 25%)',
      }} />

      {/* ── Content overlay ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`info-${content.id}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: '12%', left: '4vw',
            maxWidth: '580px',
            zIndex: 10,
          }}
        >
          {/* Premium badge */}
          {content.isPremium && (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: 'linear-gradient(135deg, #f5a623, #e8960e)',
                color: '#000', fontWeight: 800, fontSize: '11px',
                padding: '5px 14px', borderRadius: '20px',
                letterSpacing: '1.2px', marginBottom: '14px',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              👑 PREMIUM
            </motion.span>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(34px, 5.5vw, 70px)',
              color: '#ffffff',
              margin: '0 0 14px',
              lineHeight: 1.08,
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}
          >
            {content.title}
          </motion.h1>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f5a623', fontWeight: 700, fontSize: '14px' }}>
              <FiStar size={14} fill="#f5a623" />
              {content.rating?.toFixed(1) ?? 'N/A'}
            </span>
            <span style={{ color: '#b3b3cc', fontSize: '14px' }}>{content.releaseYear}</span>
            {content.duration && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b3b3cc', fontSize: '14px' }}>
                <FiClock size={13} /> {content.duration}
              </span>
            )}
            <span style={{
              background: 'rgba(255,255,255,0.12)', color: '#fff',
              padding: '3px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
            }}>
              {content.contentType || content.type || 'MOVIE'}
            </span>
            {content.language && (
              <span style={{ color: '#666680', fontSize: '13px' }}>{content.language}</span>
            )}
          </motion.div>

          {/* Genre badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}
          >
            {(content.genres || []).slice(0, 3).map((g) => (
              <span key={g.id || g.name || g} style={{
                background: 'rgba(229,9,20,0.15)',
                border: '1px solid rgba(229,9,20,0.3)',
                color: '#e50914', fontSize: '12px', fontWeight: 500,
                padding: '4px 12px', borderRadius: '20px',
                fontFamily: 'Outfit, sans-serif',
              }}>{g.name || g}</span>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              color: '#b3b3cc', fontSize: '15px', lineHeight: 1.7,
              margin: '0 0 28px',
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {content.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            {/* Play */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(229,9,20,0.55)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/watch/${content.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#e50914', color: '#fff',
                border: 'none', borderRadius: '12px',
                padding: '14px 30px', fontSize: '16px', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                boxShadow: '0 4px 20px rgba(229,9,20,0.35)',
              }}
            >
              <FiPlay size={20} fill="#fff" /> Play Now
            </motion.button>

            {/* My List */}
            <motion.button
              whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.18)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWatchlist}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.22)',
                borderRadius: '12px',
                padding: '14px 26px', fontSize: '16px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              }}
            >
              {inWatchlist ? <FiCheck size={20} color="#f5a623" /> : <FiPlus size={20} />}
              {inWatchlist ? 'In My List' : 'My List'}
            </motion.button>

            {/* More Info */}
            <motion.button
              whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/content/${content.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'transparent', color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                padding: '14px 26px', fontSize: '16px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              }}
            >
              <FiInfo size={20} /> More Info
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ── Slide indicators ── */}
      {contents.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '5%', right: '4vw',
          display: 'flex', gap: '8px', zIndex: 10,
        }}>
          {contents.slice(0, 6).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentIndex(i)}
              whileHover={{ scale: 1.2 }}
              style={{
                width: i === currentIndex ? '32px' : '8px',
                height: '8px', borderRadius: '4px',
                background: i === currentIndex ? '#e50914' : 'rgba(255,255,255,0.3)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroBanner
