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
      <defs>
        {/* Deep 3D Shadow for the overlapping ribbon folds */}
        <filter id="ribbonShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
        </filter>

        {/* Gradients to create the curved 3D lighting */}
        <linearGradient id="leftPillar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b71c1c" />
          <stop offset="50%" stopColor="#e50914" />
          <stop offset="100%" stopColor="#880e4f" />
        </linearGradient>

        <linearGradient id="rightPillar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#880e4f" />
          <stop offset="50%" stopColor="#e50914" />
          <stop offset="100%" stopColor="#b71c1c" />
        </linearGradient>

        <linearGradient id="middleFold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff3333" />
          <stop offset="30%" stopColor="#e50914" />
          <stop offset="100%" stopColor="#7f0000" />
        </linearGradient>
      </defs>

      {/* Behind/Left ribbon segment */}
      <path
        d="M20 20 C20 20, 50 12, 55 45 C58 65, 30 75, 25 90 C20 105, 20 120, 20 120 L40 120 C40 120, 42 108, 48 95 C54 82, 75 75, 78 50 C82 20, 45 20, 45 20 Z"
        fill="url(#leftPillar)"
      />

      {/* Front/Middle Diagonal Fold (casts shadow on behind segments) */}
      <path
        d="M20 120 L80 20 L95 25 L35 125 Z"
        fill="url(#middleFold)"
        filter="url(#ribbonShadow)"
      />

      {/* Behind/Right ribbon segment */}
      <path
        d="M80 120 C80 120, 50 128, 45 95 C42 75, 70 65, 75 50 C80 35, 80 20, 80 20 L60 20 C60 20, 58 32, 52 45 C46 58, 25 65, 22 90 C18 120, 55 120, 55 120 Z"
        fill="url(#rightPillar)"
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
