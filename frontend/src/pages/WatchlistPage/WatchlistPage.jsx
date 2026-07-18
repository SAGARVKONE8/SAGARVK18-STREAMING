import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiList, FiTrash2, FiSearch, FiPlay } from 'react-icons/fi'
import Navbar from '../../components/Navbar/Navbar'
import ContentCard from '../../components/ContentCard/ContentCard'
import { getWatchlist, removeFromWatchlist } from '../../api/watchlistApi'
import { useProfile } from '../../context/ProfileContext'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const SORT_OPTIONS = [
  { label: 'Date Added', value: 'date' },
  { label: 'Title A–Z',  value: 'title' },
  { label: 'Rating',     value: 'rating' },
]

const WatchlistPage = () => {
  const { selectedProfile }         = useProfile()
  const navigate                    = useNavigate()

  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [sort,    setSort]    = useState('date')

  useEffect(() => {
    if (!selectedProfile) { setLoading(false); return }
    getWatchlist(selectedProfile.id)
      .then((res) => {
        const d = res.data.data
        setItems(Array.isArray(d) ? d : d?.content || [])
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [selectedProfile?.id])

  const handleRemove = async (item) => {
    const contentId = item.id || item.contentId
    try {
      await removeFromWatchlist(selectedProfile.id, contentId)
      setItems((prev) => prev.filter((i) => (i.id || i.contentId) !== contentId))
      toast.success('Removed from My List')
    } catch {
      toast.error('Failed to remove from list')
    }
  }

  const sorted = [...items].sort((a, b) => {
    if (sort === 'title')  return (a.title || '').localeCompare(b.title || '')
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0)
    return 0 // date: keep original order
  })

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ minHeight: '100vh', background: '#080810' }}>
      <Navbar />

      <div style={{ padding: '100px 4vw 60px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap',
            gap: '16px', marginBottom: '36px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px', height: '50px', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(229,9,20,0.2), rgba(245,166,35,0.1))',
              border: '1px solid rgba(229,9,20,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FiList size={24} color="#e50914" />
            </div>
            <div>
              <h1 style={{
                fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                fontSize: 'clamp(24px, 4vw, 36px)', color: '#fff', margin: 0,
              }}>My List</h1>
              <p style={{ color: '#666680', fontFamily: 'Inter, sans-serif', fontSize: '14px', margin: 0 }}>
                {items.length} title{items.length !== 1 ? 's' : ''} saved
                {selectedProfile && ` • ${selectedProfile.name}'s list`}
              </p>
            </div>
          </div>

          {/* Sort options */}
          {items.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setSort(o.value)}
                  className="liquid-badge"
                  style={{
                    background: sort === o.value
                      ? 'linear-gradient(135deg, var(--accent-red), #ff2d3a)'
                      : 'rgba(255,255,255,0.04)',
                    color: sort === o.value ? '#fff' : '#a0a0c0',
                    borderColor: sort === o.value
                      ? 'rgba(229,9,20,0.4)'
                      : 'rgba(255,255,255,0.08)',
                    padding: '8px 18px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: sort === o.value
                      ? '0 4px 24px rgba(229,9,20,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Content */}
        {!selectedProfile ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            paddingTop: '80px', gap: '20px', textAlign: 'center',
          }}>
            <span style={{ fontSize: '72px', opacity: 0.3 }}>👤</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '22px', color: '#fff' }}>
              No Profile Selected
            </h2>
            <p style={{ color: '#666680', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
              Please select a profile to view your list
            </p>
            <button
              onClick={() => navigate('/select-profile')}
              className="liquid-btn-primary"
              style={{
                padding: '12px 28px', fontSize: '15px',
              }}
            >Select Profile</button>
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              paddingTop: '80px', gap: '24px', textAlign: 'center',
            }}
          >
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 70%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '56px',
            }}>🎬</div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '26px', color: '#fff' }}>
              Your list is empty
            </h2>
            <p style={{
              color: '#666680', fontFamily: 'Inter, sans-serif',
              fontSize: '15px', maxWidth: '380px', lineHeight: 1.7,
            }}>
              Browse movies and series, then tap <strong style={{ color: '#fff' }}>+ My List</strong> to save them here for later.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/search')}
                className="liquid-btn-primary"
                style={{
                  padding: '13px 28px', fontSize: '15px',
                }}
              >
                <FiSearch size={17} /> Discover Content
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/home')}
                className="liquid-btn-secondary"
                style={{
                  padding: '13px 28px', fontSize: '15px',
                }}
              >
                <FiPlay size={17} /> Browse Home
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div className="responsive-grid">
            <AnimatePresence>
              {sorted.map((item, i) => {
                const c = item.content || item
                return (
                  <motion.div
                    key={c.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4) }}
                    style={{ position: 'relative' }}
                  >
                    <ContentCard content={c} />
                    {/* Remove button overlay */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemove(c)}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: 'rgba(15,15,28,0.75)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(229,9,20,0.25)',
                        borderRadius: '50%',
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#e50914', cursor: 'pointer',
                        zIndex: 5,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }}
                    >
                      <FiTrash2 size={14} />
                    </motion.button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default WatchlistPage
