import React from 'react'
import { motion } from 'framer-motion'

const shimmer = {
  background: 'linear-gradient(90deg, #1a1a2e 0%, #242438 50%, #1a1a2e 100%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.6s infinite',
  borderRadius: '10px',
}

const SkeletonCard = ({ count = 1, width = 175 }) => (
  <>
    <style>{`
      @keyframes shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
      }
    `}</style>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.06 }}
        style={{
          borderRadius: '14px',
          overflow: 'hidden',
          background: '#1a1a2e',
          flexShrink: 0,
          width: `${width}px`,
        }}
      >
        {/* Poster placeholder */}
        <div style={{
          ...shimmer,
          aspectRatio: '2/3',
          width: '100%',
          borderRadius: 0,
        }} />

        {/* Text placeholders */}
        <div style={{ padding: '10px 12px 14px' }}>
          <div style={{ ...shimmer, height: '13px', width: '80%', marginBottom: '8px' }} />
          <div style={{ ...shimmer, height: '11px', width: '48%' }} />
        </div>
      </motion.div>
    ))}
  </>
)

export const SkeletonBanner = () => (
  <>
    <style>{`
      @keyframes shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
      }
    `}</style>
    <div style={{
      width: '100%',
      height: 'min(100vh, 850px)',
      minHeight: '600px',
      ...shimmer,
      borderRadius: 0,
    }} />
  </>
)

export const SkeletonRow = ({ count = 7 }) => (
  <div style={{ marginBottom: '44px' }}>
    {/* Title placeholder */}
    <div style={{ padding: '0 4vw', marginBottom: '18px' }}>
      <div style={{ ...shimmer, height: '22px', width: '220px' }} />
    </div>
    {/* Cards */}
    <div style={{
      display: 'flex', gap: '14px',
      padding: '12px 4vw 20px',
      overflowX: 'hidden',
    }}>
      <SkeletonCard count={count} />
    </div>
  </div>
)

export default SkeletonCard
