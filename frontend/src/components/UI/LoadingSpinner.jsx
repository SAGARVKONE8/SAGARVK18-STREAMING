import React from 'react'
import { motion } from 'framer-motion'

import BrandSymbol from './BrandSymbol'

const LoadingSpinner = ({ fullScreen = true, size = 'large' }) => {
  const sizeMap = { small: 28, medium: 44, large: 64 }
  const s = sizeMap[size] ?? 64

  const spinner = (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '28px',
    }}>
      {/* Cinematic Logo + Ring Container */}
      <div style={{
        position: 'relative',
        width: s * 1.8,
        height: s * 1.8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Outer glowing orbital ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px dashed rgba(229, 9, 20, 0.25)',
            borderTopColor: '#e50914',
            borderBottomColor: '#ffd700',
          }}
        />
        
        {/* Inner reverse orbital ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: '50%',
            border: '1.5px solid rgba(255, 255, 255, 0.05)',
            borderTopColor: '#ffd700',
            borderRightColor: '#e50914',
          }}
        />

        {/* Central glowing Brand Symbol */}
        <BrandSymbol size={s * 1.15} />
      </div>

      {/* Brand text (only on full-screen) */}
      {fullScreen && (
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <span style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 900,
            fontSize: '22px',
            background: 'linear-gradient(135deg, #e50914, #ffd700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '3px',
            filter: 'drop-shadow(0 4px 12px rgba(229,9,20,0.15))'
          }}>SAGARVK18</span>
          <span style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 300,
            fontSize: '10px',
            color: '#888888',
            letterSpacing: '5px',
          }}>STREAMING</span>
        </motion.div>
      )}
    </div>
  )

  if (!fullScreen) return spinner

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {spinner}
    </div>
  )
}

export default LoadingSpinner
