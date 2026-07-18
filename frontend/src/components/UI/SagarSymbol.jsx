import React from 'react'
import { motion } from 'framer-motion'

const SagarSymbol = ({ width = 36, height = 50, animated = true }) => {
  const symbolSVG = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Behind/Left ribbon segment - Pure Bold Dark Crimson */}
      <path
        d="M20 20 C20 20, 50 12, 55 45 C58 65, 30 75, 25 90 C20 105, 20 120, 20 120 L40 120 C40 120, 42 108, 48 95 C54 82, 75 75, 78 50 C82 20, 45 20, 45 20 Z"
        fill="#b81d24"
      />

      {/* Front/Middle Diagonal Fold - Pure Bold Netflix Red */}
      <path
        d="M20 120 L80 20 L95 25 L35 125 Z"
        fill="#e50914"
      />

      {/* Behind/Right ribbon segment - Pure Bold Dark Crimson */}
      <path
        d="M80 120 C80 120, 50 128, 45 95 C42 75, 70 65, 75 50 C80 35, 80 20, 80 20 L60 20 C60 20, 58 32, 52 45 C46 58, 25 65, 22 90 C18 120, 55 120, 55 120 Z"
        fill="#b81d24"
      />
    </svg>
  )

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ width, height, cursor: 'pointer', display: 'inline-block' }}
      >
        {symbolSVG}
      </motion.div>
    )
  }

  return (
    <div style={{ width, height, display: 'inline-block' }}>
      {symbolSVG}
    </div>
  )
}

export default SagarSymbol
