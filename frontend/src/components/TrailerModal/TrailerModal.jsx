import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import ReactPlayer from 'react-player'

const TrailerModal = ({ isOpen, onClose, trailerUrl, title }) => {
  /* ESC key closes */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <motion.div
            initial={{ scale: 0.82, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.82, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%', maxWidth: '920px',
              background: '#12121e',
              borderRadius: '22px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 22px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(10,10,15,0.6)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>🎬</span>
                <h3 style={{
                  margin: 0, color: '#fff',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 700, fontSize: '17px',
                }}>
                  {title ? `${title} — Trailer` : 'Trailer'}
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, background: 'rgba(229,9,20,0.2)' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%', color: '#fff',
                  width: '38px', height: '38px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <FiX size={18} />
              </motion.button>
            </div>

            {/* Video player */}
            <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
              {trailerUrl ? (
                <ReactPlayer
                  url={trailerUrl}
                  width="100%"
                  height="100%"
                  playing={isOpen}
                  controls
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  config={{
                    youtube: {
                      playerVars: { modestbranding: 1, rel: 0, showinfo: 0 },
                    },
                  }}
                />
              ) : (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#666680', gap: '16px',
                }}>
                  <span style={{ fontSize: '56px' }}>🎬</span>
                  <p style={{
                    fontFamily: 'Outfit, sans-serif',
                    margin: 0, fontSize: '16px', color: '#b3b3cc',
                  }}>
                    No trailer available for this title
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TrailerModal
