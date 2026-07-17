import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ fullScreen = true, size = 'large' }) => {
  const sizeMap = { small: 28, medium: 44, large: 64 }
  const s = sizeMap[size] ?? 64

  const spinner = (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '22px',
    }}>
      {/* Ring container */}
      <div style={{ position: 'relative', width: s, height: s }}>
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `${Math.max(2, s / 20)}px solid rgba(229,9,20,0.18)`,
            borderTopColor: '#e50914',
          }}
        />
        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.7, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: `${s * 0.15}px`,
            borderRadius: '50%',
            border: `${Math.max(2, s / 24)}px solid rgba(245,166,35,0.18)`,
            borderTopColor: '#f5a623',
          }}
        />
        {/* Inner pulsing dot */}
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: `${s * 0.38}px`,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e50914, #f5a623)',
          }}
        />
      </div>

      {/* Brand text (only on full-screen) */}
      {fullScreen && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <span style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 900,
            fontSize: '20px',
            background: 'linear-gradient(135deg, #e50914, #f5a623)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
          }}>SAGARVK18</span>
          <span style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 300,
            fontSize: '10px',
            color: '#666680',
            letterSpacing: '4px',
          }}>STREAMING</span>
        </motion.div>
      )}
    </div>
  )

  if (!fullScreen) return spinner

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {spinner}
    </div>
  )
}

export default LoadingSpinner
