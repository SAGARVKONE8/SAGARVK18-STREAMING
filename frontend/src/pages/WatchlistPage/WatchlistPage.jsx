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
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
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
                  style={{
                    background: sort === o.value ? '#e50914' : 'rgba(26,26,46,0.7)',
                    color: sort === o.value ? '#fff' : '#b3b3cc',
                    border: sort === o.value ? '1px solid #e50914' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px', padding: '8px 18px',
                    fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                    fontSize: '13px', cursor: 'pointer',
                    transition: 'all 0.2s',
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
              style={{
                background: '#e50914', color: '#fff',
                border: 'none', borderRadius: '12px',
                padding: '12px 28px', fontSize: '15px',
                fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
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
                whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(229,9,20,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/search')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#e50914', color: '#fff',
                  border: 'none', borderRadius: '12px',
                  padding: '13px 28px', fontSize: '15px',
                  fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                <FiSearch size={17} /> Discover Content
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/home')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px', padding: '13px 28px',
                  fontSize: '15px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                }}
              >
                <FiPlay size={17} /> Browse Home
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
              gap: '18px',
            }}
          >
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
                        background: 'rgba(10,10,15,0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(229,9,20,0.3)',
                        borderRadius: '50%',
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#e50914', cursor: 'pointer',
                        zIndex: 5,
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
