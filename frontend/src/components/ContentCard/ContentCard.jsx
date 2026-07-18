import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlay, FiPlus, FiStar, FiCheck } from 'react-icons/fi'
import { addToWatchlist, removeFromWatchlist } from '../../api/watchlistApi'
import { useProfile } from '../../context/ProfileContext'
import toast from 'react-hot-toast'

const ContentCard = ({ content }) => {
  const [hovered, setHovered] = useState(false)
  const [inList,  setInList]  = useState(false)
  const { selectedProfile }   = useProfile()
  const navigate              = useNavigate()

  if (!content) return null

  const posterUrl =
    content.posterUrl ||
    `https://picsum.photos/seed/${content.id || 'x'}/300/450`

  const handleWatchlist = async (e) => {
    e.stopPropagation()
    if (!selectedProfile) {
      toast.error('Select a profile first')
      return
    }
    try {
      if (inList) {
        await removeFromWatchlist(selectedProfile.id, content.id)
        setInList(false)
        toast.success('Removed from My List')
      } else {
        await addToWatchlist(selectedProfile.id, content.id)
        setInList(true)
        toast.success('Added to My List 🎬')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  const handlePlay = (e) => {
    e.stopPropagation()
    navigate(`/watch/${content.id}`)
  }

  return (
    <motion.div
      className="content-card-responsive"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => navigate(`/content/${content.id}`)}
      style={{
        position:   'relative',
        width:      '100%',
        borderRadius: '18px',
        overflow:   'hidden',
        border:     '1px solid rgba(255,255,255,0.06)',
        borderTopColor: 'rgba(255,255,255,0.1)',
        background: 'rgba(14,14,28,0.5)',
        boxShadow:  hovered
          ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(229,9,20,0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <motion.div
        animate={{ scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* ── Poster ── */}
        <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
          <img
            src={posterUrl}
            alt={content.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${content.id}/300/450`
            }}
          />

          {/* Badges */}
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            {content.isPremium && (
              <span className="liquid-badge liquid-badge-premium"
                style={{ fontSize: '9px', padding: '3px 10px' }}
              >👑 PREMIUM</span>
            )}
            {content.quality && (
              <span className="liquid-badge liquid-badge-quality"
                style={{ fontSize: '9px', padding: '3px 10px' }}
              >{content.quality}</span>
            )}
          </div>

          {/* Hover overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(10,10,15,0.97) 0%, rgba(10,10,15,0.45) 55%, transparent 100%)',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-end', padding: '12px',
                }}
              >
                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={handlePlay}
                    className="liquid-btn-primary"
                    style={{
                      flex: 1,
                      borderRadius: '10px',
                      padding: '8px',
                      fontSize: '12px',
                      justifyContent: 'center',
                    }}
                  >
                    <FiPlay size={13} fill="#fff" /> Play
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={handleWatchlist}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderTopColor: 'rgba(255,255,255,0.22)',
                      borderRadius: '10px', color: '#fff',
                      cursor: 'pointer', padding: '8px 10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                    }}
                  >
                    {inList
                      ? <FiCheck size={14} color="#f5a623" />
                      : <FiPlus size={14} />}
                  </motion.button>
                </div>

                {/* Title */}
                <p style={{
                  margin: '0 0 5px', color: '#fff', fontWeight: 700,
                  fontSize: '13px', fontFamily: 'Outfit, sans-serif',
                  lineHeight: 1.3,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{content.title}</p>

                {/* Rating + Year + Genre */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {content.rating && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '3px',
                      color: '#f5a623', fontSize: '11px', fontWeight: 600,
                    }}>
                      <FiStar size={11} fill="#f5a623" />
                      {content.rating.toFixed(1)}
                    </span>
                  )}
                  <span style={{ color: '#666680', fontSize: '11px' }}>{content.releaseYear}</span>
                  {(content.genres?.[0] || content.genre) && (
                    <span className="liquid-badge" style={{
                      background: 'rgba(229,9,20,0.12)',
                      borderColor: 'rgba(229,9,20,0.25)',
                      color: '#e50914',
                      fontSize: '10px', padding: '2px 10px',
                    }}>
                      {content.genres?.[0]?.name || content.genre}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Below-poster info ── */}
        <div className="card-info-container" style={{
          background: 'rgba(12,12,24,0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          <p
            className="card-title-text"
            style={{
              margin: '0 0 4px', color: '#e8e8f4', fontWeight: 600,
              fontFamily: 'Outfit, sans-serif',
              lineHeight: 1.3, letterSpacing: '0.2px',
              display: '-webkit-box', WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {content.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {content.rating && (
              <span
                className="card-meta-text"
                style={{
                  color: '#f5a623', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '3px',
                }}
              >
                <FiStar size={10} fill="#f5a623" />
                {content.rating.toFixed(1)}
              </span>
            )}
            <span className="card-meta-text" style={{ color: '#5a5a80' }}>
              {content.releaseYear}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ContentCard
