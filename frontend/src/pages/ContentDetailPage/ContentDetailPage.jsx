import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiPlay, FiPlus, FiCheck, FiStar, FiClock, FiCalendar,
  FiGlobe, FiArrowLeft, FiThumbsUp, FiLock
} from 'react-icons/fi'
import { MdOutlineHd } from 'react-icons/md'
import Navbar from '../../components/Navbar/Navbar'
import ContentRow from '../../components/ContentRow/ContentRow'
import TrailerModal from '../../components/TrailerModal/TrailerModal'
import { getContent, getRatings, rateContent, getTrending } from '../../api/contentApi'
import { addToWatchlist, removeFromWatchlist, checkWatchlist } from '../../api/watchlistApi'
import { useProfile } from '../../context/ProfileContext'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <FiStar
          key={n}
          size={20}
          fill={(hovered || value) >= n ? '#f5a623' : 'none'}
          color={(hovered || value) >= n ? '#f5a623' : '#3a3a55'}
          style={{ cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        />
      ))}
    </div>
  )
}

const ContentDetailPage = () => {
  const { id }                      = useParams()
  const navigate                    = useNavigate()
  const { selectedProfile }         = useProfile()
  const { isPremium }               = useAuth()

  const [content,      setContent]      = useState(null)
  const [related,      setRelated]      = useState([])
  const [ratings,      setRatings]      = useState([])
  const [inList,       setInList]       = useState(false)
  const [userRating,   setUserRating]   = useState(0)
  const [trailerOpen,  setTrailerOpen]  = useState(false)
  const [loading,      setLoading]      = useState(true)
  const [expandEps,    setExpandEps]    = useState(false)

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const [cRes, rRes] = await Promise.all([
          getContent(id),
          getRatings(id).catch(() => ({ data: { data: [] } })),
        ])
        setContent(cRes.data.data)
        setRatings(Array.isArray(rRes.data.data) ? rRes.data.data : [])

        if (selectedProfile) {
          const chk = await checkWatchlist(selectedProfile.id, id).catch(() => ({ data: { data: false } }))
          setInList(!!chk.data.data)
        }

        // Load related
        const rel = await getTrending().catch(() => ({ data: { data: [] } }))
        const all = Array.isArray(rel.data.data) ? rel.data.data : rel.data.data?.content || []
        setRelated(all.filter((c) => c.id !== Number(id)).slice(0, 10))
      } catch {
        toast.error('Failed to load content')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, selectedProfile?.id])

  const handleWatchlist = async () => {
    if (!selectedProfile) { toast.error('Select a profile first'); return }
    try {
      if (inList) {
        await removeFromWatchlist(selectedProfile.id, id)
        setInList(false)
        toast.success('Removed from My List')
      } else {
        await addToWatchlist(selectedProfile.id, id)
        setInList(true)
        toast.success('Added to My List 🎬')
      }
    } catch { toast.error('Something went wrong') }
  }

  const handleRate = async (score) => {
    if (!selectedProfile) {
      toast.error('Please select a profile first')
      return
    }
    setUserRating(score)
    try {
      await rateContent(id, { rating: score, profileId: selectedProfile.id })
      toast.success(`Rated ${score}/10 ⭐`)
    } catch {
      toast.error('Failed to submit rating')
    }
  }

  const handlePlay = () => {
    if (content?.isPremium && !isPremium) {
      toast('Upgrade to Premium to watch this title 👑', { icon: '🔒' })
      navigate('/account')
      return
    }
    navigate(`/watch/${id}`)
  }

  if (loading) return <LoadingSpinner />

  if (!content) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: '24px', fontFamily: 'Outfit, sans-serif' }}>Content not found</p>
        <button onClick={() => navigate('/home')} style={{
          background: '#e50914', color: '#fff', border: 'none',
          borderRadius: '12px', padding: '12px 24px', cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginTop: '16px',
        }}>Go Home</button>
      </div>
    </div>
  )

  const backdropUrl = content.backdropUrl || content.posterUrl ||
    `https://picsum.photos/seed/${content.id}/1920/1080`
  const posterUrl   = content.posterUrl || `https://picsum.photos/seed/${content.id}/400/600`

  const avgRating = ratings.length
    ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
    : content.rating?.toFixed(1) || 'N/A'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={content.trailerUrl}
        title={content.title}
      />

      {/* ── Backdrop hero ── */}
      <div style={{ position: 'relative', height: '65vh', minHeight: '420px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${backdropUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center 20%',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.6) 50%, rgba(10,10,15,0.3) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(10,10,15,0.5), transparent 60%)',
        }} />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }}
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: '88px', left: '4vw',
            background: 'rgba(10,10,15,0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', borderRadius: '12px',
            padding: '10px 18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: 600,
          }}
        >
          <FiArrowLeft size={17} /> Back
        </motion.button>
      </div>

      {/* ── Main content ── */}
      <div style={{ padding: '0 4vw 60px', marginTop: '-120px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ flexShrink: 0 }}
          >
            <img
              src={posterUrl}
              alt={content.title}
              style={{
                width: '220px', height: '330px',
                objectFit: 'cover', borderRadius: '20px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${content.id}/400/600` }}
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ flex: 1, minWidth: '280px' }}
          >
            {/* Premium badge */}
            {content.isPremium && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: 'linear-gradient(135deg, #f5a623, #e8960e)',
                color: '#000', fontWeight: 800, fontSize: '11px',
                padding: '4px 14px', borderRadius: '20px',
                letterSpacing: '1px', marginBottom: '12px',
                fontFamily: 'Outfit, sans-serif',
              }}>👑 PREMIUM</span>
            )}

            <h1 style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 900,
              fontSize: 'clamp(28px, 4vw, 52px)',
              color: '#fff', margin: '0 0 16px',
              lineHeight: 1.1,
            }}>{content.title}</h1>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f5a623', fontWeight: 700, fontSize: '15px' }}>
                <FiStar size={15} fill="#f5a623" /> {avgRating}
              </span>
              <span style={{ color: '#b3b3cc', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FiCalendar size={14} /> {content.releaseYear}
              </span>
              {content.duration && (
                <span style={{ color: '#b3b3cc', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FiClock size={14} /> {content.duration}
                </span>
              )}
              {content.language && (
                <span style={{ color: '#b3b3cc', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FiGlobe size={14} /> {content.language}
                </span>
              )}
              <span style={{
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                padding: '3px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
              }}>
                {content.contentType || content.type || 'MOVIE'}
              </span>
              {content.ageRating && (
                <span style={{
                  border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff',
                  padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                }}>{content.ageRating}</span>
              )}
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                color: '#4fadf7', fontSize: '13px', fontWeight: 700,
              }}>
                <MdOutlineHd size={18} /> {content.quality || 'HD'}
              </span>
            </div>

            {/* Genres */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {(content.genres || []).map((g) => (
              <span key={g.id || g.name || g} style={{
                background: 'rgba(229,9,20,0.15)',
                border: '1px solid rgba(229,9,20,0.3)',
                color: '#e50914', fontSize: '12px', fontWeight: 500,
                padding: '4px 12px', borderRadius: '20px',
                fontFamily: 'Outfit, sans-serif',
              }}>{g.name || g}</span>
            ))}
            </div>

            {/* Description */}
            <p style={{
              color: '#b3b3cc', fontSize: '15px', lineHeight: 1.75,
              fontFamily: 'Inter, sans-serif', maxWidth: '680px', marginBottom: '24px',
            }}>
              {content.description}
            </p>

            {/* Director / Cast */}
            {content.director && (
              <p style={{ color: '#666680', fontSize: '14px', fontFamily: 'Inter, sans-serif', marginBottom: '8px' }}>
                <strong style={{ color: '#b3b3cc' }}>Director:</strong> {content.director}
              </p>
            )}
            {content.cast && (
              <p style={{ color: '#666680', fontSize: '14px', fontFamily: 'Inter, sans-serif', marginBottom: '24px' }}>
                <strong style={{ color: '#b3b3cc' }}>Cast:</strong> {Array.isArray(content.cast) ? content.cast.join(', ') : content.cast}
              </p>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 28px rgba(229,9,20,0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlay}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: '#e50914', color: '#fff',
                  border: 'none', borderRadius: '12px',
                  padding: '14px 30px', fontSize: '16px', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                }}
              >
                {content.isPremium && !isPremium
                  ? <><FiLock size={18} /> Unlock Premium</>
                  : <><FiPlay size={18} fill="#fff" /> Play</>}
              </motion.button>

              {content.trailerUrl && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTrailerOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px', padding: '14px 24px',
                    fontSize: '16px', fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  ▷ Trailer
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWatchlist}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: inList ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.08)',
                  color: inList ? '#f5a623' : '#fff',
                  border: inList ? '1px solid rgba(245,166,35,0.35)' : '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '12px', padding: '14px 22px',
                  fontSize: '16px', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {inList ? <FiCheck size={18} /> : <FiPlus size={18} />}
                {inList ? 'In My List' : 'My List'}
              </motion.button>
            </div>

            {/* User rating */}
            <div style={{
              background: 'rgba(26,26,46,0.6)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '20px 24px',
              display: 'inline-block',
            }}>
              <p style={{
                color: '#b3b3cc', fontFamily: 'Outfit, sans-serif',
                fontWeight: 600, fontSize: '13px', marginBottom: '12px',
                textTransform: 'uppercase', letterSpacing: '0.8px',
              }}>
                <FiThumbsUp size={13} style={{ marginRight: '6px' }} />
                Rate This Title
              </p>
              <StarRating value={userRating} onChange={handleRate} />
              {userRating > 0 && (
                <p style={{ color: '#f5a623', fontSize: '13px', fontFamily: 'Outfit, sans-serif', marginTop: '8px' }}>
                  Your rating: {userRating}/10
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Episodes section (for series) ── */}
        {(content.contentType === 'SERIES' || content.type === 'SERIES') && content.episodes?.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700,
              fontSize: '22px', color: '#fff', marginBottom: '20px',
            }}>Episodes</h2>
            <div style={{
              background: 'rgba(26,26,46,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', overflow: 'hidden',
            }}>
              {(expandEps ? content.episodes : content.episodes.slice(0, 5)).map((ep, i) => (
                <motion.div
                  key={ep.id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ background: 'rgba(255,255,255,0.04)' }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/watch/${content.id}`)}
                >
                  <span style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'rgba(229,9,20,0.15)',
                    border: '1px solid rgba(229,9,20,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#e50914', fontWeight: 700, fontSize: '14px',
                    flexShrink: 0,
                  }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '15px' }}>
                      {ep.title || `Episode ${i + 1}`}
                    </p>
                    {ep.duration && (
                      <p style={{ margin: '3px 0 0', color: '#666680', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
                        {ep.duration}
                      </p>
                    )}
                  </div>
                  <FiPlay size={16} color="#e50914" />
                </motion.div>
              ))}
              {content.episodes.length > 5 && (
                <button
                  onClick={() => setExpandEps((v) => !v)}
                  style={{
                    width: '100%', padding: '14px',
                    background: 'none', border: 'none',
                    color: '#f5a623', fontFamily: 'Outfit, sans-serif',
                    fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  {expandEps ? 'Show Less ▲' : `Show All ${content.episodes.length} Episodes ▼`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        {ratings.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '22px', color: '#fff', marginBottom: '20px' }}>
              User Reviews
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {ratings.slice(0, 6).map((r, i) => (
                <div key={i} style={{
                  background: 'rgba(26,26,46,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', padding: '20px',
                  minWidth: '220px', flex: '1',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <FiStar size={15} fill="#f5a623" color="#f5a623" />
                    <span style={{ color: '#f5a623', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{r.rating}/10</span>
                  </div>
                  {r.review && (
                    <p style={{ color: '#b3b3cc', fontSize: '14px', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, margin: 0 }}>
                      {r.review}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Related content ── */}
        {related.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <ContentRow title="More Like This" contents={related} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentDetailPage
