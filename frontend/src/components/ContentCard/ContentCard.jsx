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
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => navigate(`/content/${content.id}`)}
      style={{
        position:   'relative',
        width:      '175px',
        cursor:     'pointer',
        borderRadius: '14px',
        overflow:   'hidden',
        background: '#1a1a2e',
        boxShadow:  hovered
          ? '0 24px 60px rgba(0,0,0,0.65), 0 0 0 1.5px rgba(229,9,20,0.4)'
          : '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.3s ease',
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
              <span style={{
                background: 'linear-gradient(135deg, #f5a623, #e8960e)',
                color: '#000', fontWeight: 800, fontSize: '9px',
                padding: '3px 8px', borderRadius: '6px',
                fontFamily: 'Outfit, sans-serif', letterSpacing: '0.5px',
              }}>👑 PREMIUM</span>
            )}
            {content.quality && (
              <span style={{
                background: content.quality === '4K'
                  ? 'linear-gradient(135deg, rgba(114,9,183,0.9), rgba(86,11,173,0.9))'
                  : 'rgba(0,100,200,0.85)',
                color: '#fff', fontWeight: 700, fontSize: '9px',
                padding: '3px 8px', borderRadius: '6px',
                fontFamily: 'Outfit, sans-serif',
              }}>{content.quality}</span>
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
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handlePlay}
                    style={{
                      flex: 1,
                      background: '#e50914', border: 'none',
                      borderRadius: '8px', color: '#fff',
                      fontWeight: 700, fontSize: '12px',
                      cursor: 'pointer', padding: '8px',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '4px',
                      fontFamily: 'Outfit, sans-serif',
                    }}
                  >
                    <FiPlay size={13} fill="#fff" /> Play
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleWatchlist}
                    style={{
                      background: 'rgba(255,255,255,0.14)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px', color: '#fff',
                      cursor: 'pointer', padding: '8px 10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                    <span style={{
                      background: 'rgba(229,9,20,0.22)', color: '#e50914',
                      fontSize: '10px', padding: '2px 8px',
                      borderRadius: '10px', fontWeight: 500,
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
        <div style={{ padding: '10px 12px 13px' }}>
          <p style={{
            margin: '0 0 4px', color: '#e0e0f0', fontWeight: 600,
            fontSize: '13px', fontFamily: 'Outfit, sans-serif',
            lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{content.title}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {content.rating && (
              <span style={{
                color: '#f5a623', fontSize: '11px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '3px',
              }}>
                <FiStar size={10} fill="#f5a623" />
                {content.rating.toFixed(1)}
              </span>
            )}
            <span style={{ color: '#666680', fontSize: '11px' }}>{content.releaseYear}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ContentCard
