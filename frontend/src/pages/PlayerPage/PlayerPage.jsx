import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ReactPlayer from 'react-player'
import {
  FiArrowLeft, FiPlay, FiPause, FiVolume2, FiVolumeX,
  FiMaximize, FiMinimize, FiSettings, FiSkipBack, FiSkipForward
} from 'react-icons/fi'
import { getContent } from '../../api/contentApi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const formatTime = (secs) => {
  const s = Math.floor(secs || 0)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

const PlayerPage = () => {
  const { id }           = useParams()
  const navigate         = useNavigate()
  const { isPremium }    = useAuth()

  const [content,     setContent]    = useState(null)
  const [playing,     setPlaying]    = useState(true)
  const [muted,       setMuted]      = useState(false)
  const [volume,      setVolume]     = useState(0.85)
  const [played,      setPlayed]     = useState(0)
  const [duration,    setDuration]   = useState(0)
  const [fullscreen,  setFullscreen] = useState(false)
  const [showCtrl,    setShowCtrl]   = useState(true)
  const [loading,     setLoading]    = useState(true)
  const [quality,     setQuality]    = useState('Auto')
  const [showQuality, setShowQuality]= useState(false)

  const playerRef     = useRef(null)
  const containerRef  = useRef(null)
  const hideTimer     = useRef(null)

  /* Load content */
  useEffect(() => {
    getContent(id)
      .then((res) => {
        const c = res.data.data
        if (c?.isPremium && !isPremium) {
          toast('This is a premium title. Upgrade to watch.', { icon: '👑' })
          navigate(`/content/${id}`)
          return
        }
        setContent(c)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Content not found')
        navigate('/home')
      })
  }, [id, isPremium, navigate])

  /* Auto-hide controls */
  const resetHideTimer = useCallback(() => {
    setShowCtrl(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      if (playing) setShowCtrl(false)
    }, 3500)
  }, [playing])

  useEffect(() => {
    resetHideTimer()
    return () => clearTimeout(hideTimer.current)
  }, [playing, resetHideTimer])

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          setPlaying((v) => !v)
          resetHideTimer()
          break
        case 'ArrowRight':
          playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 10)
          resetHideTimer()
          break
        case 'ArrowLeft':
          playerRef.current?.seekTo(Math.max(0, playerRef.current.getCurrentTime() - 10))
          resetHideTimer()
          break
        case 'KeyF':
          toggleFullscreen()
          break
        case 'KeyM':
          setMuted((v) => !v)
          break
        default: break
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [resetHideTimer])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    playerRef.current?.seekTo(ratio)
    setPlayed(ratio)
  }

  const videoUrl = content?.videoUrl || content?.trailerUrl || ''

  if (loading || !content) {
    return (
      <div style={{
        minHeight: '100vh', background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 20px',
            border: '3px solid rgba(229,9,20,0.2)',
            borderTopColor: '#e50914',
            animation: 'spin 0.9s linear infinite',
          }} />
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
          <p style={{ color: '#666680', fontFamily: 'Outfit, sans-serif', fontSize: '15px' }}>
            Loading player…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
      style={{
        position: 'relative', width: '100vw', height: '100vh',
        background: '#000', overflow: 'hidden',
        cursor: showCtrl ? 'default' : 'none',
      }}
    >
      {/* Video player */}
      {videoUrl ? (
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          volume={muted ? 0 : volume}
          width="100%"
          height="100%"
          onProgress={({ played }) => setPlayed(played)}
          onDuration={setDuration}
          onEnded={() => setPlaying(false)}
          style={{ position: 'absolute', top: 0, left: 0 }}
          config={{
            youtube: { playerVars: { modestbranding: 1, rel: 0 } },
            file: { attributes: { style: { width: '100%', height: '100%', objectFit: 'contain' } } },
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #000 100%)',
          gap: '20px',
        }}>
          <span style={{ fontSize: '80px', opacity: 0.3 }}>🎬</span>
          <p style={{
            color: '#b3b3cc', fontFamily: 'Outfit, sans-serif',
            fontSize: '18px', fontWeight: 600,
          }}>
            {content.title}
          </p>
          <p style={{ color: '#666680', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
            Video stream unavailable for this title
          </p>
        </div>
      )}

      {/* Controls overlay */}
      <AnimatePresence>
        {showCtrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.85) 100%)',
            }}
          >
            {/* Top bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '20px 24px',
            }}>
              <motion.button
                whileHover={{ scale: 1.08, background: 'rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.94 }}
                onClick={() => navigate(-1)}
                style={{
                  background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', borderRadius: '10px',
                  padding: '8px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: 600,
                }}
              >
                <FiArrowLeft size={18} /> Back
              </motion.button>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{
                  margin: 0, color: '#fff',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                  fontSize: '16px',
                }}>{content.title}</p>
              </div>

              {/* Quality selector */}
              <div style={{ position: 'relative' }}>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  onClick={() => setShowQuality((v) => !v)}
                  style={{
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff', borderRadius: '10px',
                    padding: '8px 14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontFamily: 'Outfit, sans-serif', fontSize: '13px', fontWeight: 600,
                  }}
                >
                  <FiSettings size={15} /> {quality}
                </motion.button>
                <AnimatePresence>
                  {showQuality && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      style={{
                        position: 'absolute', top: '44px', right: 0,
                        background: 'rgba(18,18,30,0.98)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px', overflow: 'hidden',
                        minWidth: '120px',
                      }}
                    >
                      {['Auto', '1080p', '720p', '480p', '360p'].map((q) => (
                        <div
                          key={q}
                          onClick={() => { setQuality(q); setShowQuality(false) }}
                          style={{
                            padding: '10px 16px', cursor: 'pointer',
                            color: quality === q ? '#e50914' : '#b3b3cc',
                            fontFamily: 'Outfit, sans-serif', fontSize: '14px',
                            fontWeight: quality === q ? 700 : 400,
                            background: quality === q ? 'rgba(229,9,20,0.1)' : 'transparent',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = quality === q ? 'rgba(229,9,20,0.1)' : 'transparent' }}
                        >
                          {q}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Center play indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPlaying((v) => !v)}
                style={{
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  color: '#fff', borderRadius: '50%',
                  width: '72px', height: '72px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {playing
                  ? <FiPause size={32} />
                  : <FiPlay size={32} fill="#fff" style={{ marginLeft: '4px' }} />}
              </motion.button>
            </div>

            {/* Bottom controls */}
            <div style={{ padding: '0 24px 24px' }}>
              {/* Progress bar */}
              <div
                onClick={handleSeek}
                style={{
                  height: '5px', background: 'rgba(255,255,255,0.2)',
                  borderRadius: '3px', cursor: 'pointer', marginBottom: '16px',
                  position: 'relative',
                }}
              >
                <motion.div
                  style={{
                    height: '100%', borderRadius: '3px',
                    background: 'linear-gradient(to right, #e50914, #f5a623)',
                    width: `${played * 100}%`,
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute', right: '-6px', top: '-4px',
                    width: '13px', height: '13px', borderRadius: '50%',
                    background: '#fff', boxShadow: '0 0 8px rgba(229,9,20,0.6)',
                  }} />
                </motion.div>
              </div>

              {/* Control row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Seek back */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => playerRef.current?.seekTo(Math.max(0, playerRef.current.getCurrentTime() - 10))}
                  style={iconBtnStyle}
                >
                  <FiSkipBack size={22} />
                </motion.button>

                {/* Play / Pause */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPlaying((v) => !v)}
                  style={iconBtnStyle}
                >
                  {playing
                    ? <FiPause size={22} />
                    : <FiPlay size={22} fill="#fff" style={{ marginLeft: '2px' }} />}
                </motion.button>

                {/* Seek forward */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 10)}
                  style={iconBtnStyle}
                >
                  <FiSkipForward size={22} />
                </motion.button>

                {/* Volume */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMuted((v) => !v)}
                  style={iconBtnStyle}
                >
                  {muted || volume === 0 ? <FiVolumeX size={22} /> : <FiVolume2 size={22} />}
                </motion.button>

                {/* Volume slider */}
                <input
                  type="range" min={0} max={1} step={0.02}
                  value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false) }}
                  style={{
                    width: '80px', accentColor: '#e50914',
                    cursor: 'pointer',
                  }}
                />

                {/* Time */}
                <span style={{
                  color: '#b3b3cc', fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px', marginLeft: '4px',
                }}>
                  {formatTime(played * duration)} / {formatTime(duration)}
                </span>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Fullscreen */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFullscreen}
                  style={iconBtnStyle}
                >
                  {fullscreen ? <FiMinimize size={22} /> : <FiMaximize size={22} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const iconBtnStyle = {
  background: 'none', border: 'none',
  color: '#fff', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '6px', borderRadius: '8px',
  transition: 'background 0.15s',
}

export default PlayerPage
