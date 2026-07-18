import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import ContentCard from '../ContentCard/ContentCard'

const ContentRow = ({ title, contents = [], showAllLink }) => {
  const rowRef = useRef(null)

  const scroll = (dir) => {
    if (!rowRef.current) return
    rowRef.current.scrollBy({ left: dir === 'left' ? -620 : 620, behavior: 'smooth' })
  }

  if (!contents.length) return null

  return (
    <div style={{ marginBottom: '44px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4vw', marginBottom: '18px',
      }}>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(18px, 2.3vw, 26px)',
            color: '#ffffff',
            margin: 0,
          }}
        >
          {title}
        </motion.h2>

        {showAllLink && (
          <Link
            to={showAllLink}
            style={{
              color: '#f5a623', fontFamily: 'Outfit, sans-serif',
              fontWeight: 500, fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '4px',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            See All <FiChevronRight size={16} />
          </Link>
        )}
      </div>

      {/* Scrollable track */}
      <div style={{ position: 'relative' }}>
        {/* Left arrow */}
        <ArrowBtn direction="left" onClick={() => scroll('left')} />

        <div
          ref={rowRef}
          style={{
            display: 'flex',
            gap: '14px',
            overflowX: 'auto',
            padding: '12px 4vw 20px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {contents.map((item, idx) => (
            <motion.div
              key={item.id}
              className="row-item-responsive"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.3) }}
              style={{ flexShrink: 0 }}
            >
              <ContentCard content={item} />
            </motion.div>
          ))}
        </div>

        {/* Right arrow */}
        <ArrowBtn direction="right" onClick={() => scroll('right')} />
      </div>
    </div>
  )
}

const ArrowBtn = ({ direction, onClick }) => (
  <motion.button
    className="row-arrow-btn"
    whileHover={{ scale: 1.12, background: 'rgba(255,255,255,0.1)' }}
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    style={{
      position: 'absolute',
      [direction === 'left' ? 'left' : 'right']: '2px',
      top: '50%', transform: 'translateY(-50%)',
      zIndex: 10,
      background: 'rgba(15,15,28,0.55)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderTopColor: 'rgba(255,255,255,0.16)',
      color: '#fff', borderRadius: '50%',
      width: '44px', height: '44px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
      transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
    }}
  >
    {direction === 'left' ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
  </motion.button>
)

export default ContentRow
