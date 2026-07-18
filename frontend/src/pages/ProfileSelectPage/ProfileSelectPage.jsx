import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'
import { createProfile, deleteProfile } from '../../api/userApi'
import toast from 'react-hot-toast'

const AVATAR_COLORS = [
  { bg: 'linear-gradient(135deg, #e50914, #c80000)', label: 'Red' },
  { bg: 'linear-gradient(135deg, #f5a623, #e8960e)', label: 'Gold' },
  { bg: 'linear-gradient(135deg, #00b4d8, #0096b7)', label: 'Blue' },
  { bg: 'linear-gradient(135deg, #7209b7, #560bad)', label: 'Purple' },
  { bg: 'linear-gradient(135deg, #06d6a0, #04b084)', label: 'Green' },
  { bg: 'linear-gradient(135deg, #fb5607, #d44e06)', label: 'Orange' },
]

const ProfileCard = ({ profile, onSelect, onDelete, editMode }) => {
  const colorIndex = profile.id % AVATAR_COLORS.length
  const { bg } = AVATAR_COLORS[colorIndex]
  const initial = (profile.name?.[0] || '?').toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: editMode ? 1 : 1.06, y: editMode ? 0 : -6 }}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '14px',
        cursor: 'pointer', position: 'relative',
        padding: '8px',
      }}
      onClick={() => !editMode && onSelect(profile)}
    >
      {/* Delete button in edit mode */}
      {editMode && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => { e.stopPropagation(); onDelete(profile.id) }}
          style={{
            position: 'absolute', top: '-2px', right: '-2px',
            width: '26px', height: '26px', borderRadius: '50%',
            background: '#e50914', border: '2px solid #0a0a0f',
            color: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', zIndex: 10,
          }}
        >
          <FiX size={12} />
        </motion.button>
      )}

      {/* Avatar */}
      <div style={{
        width: '120px', height: '120px', borderRadius: '24px',
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '52px', fontWeight: 900,
        fontFamily: 'Outfit, sans-serif', color: '#fff',
        boxShadow: editMode
          ? '0 0 0 3px rgba(229,9,20,0.5)'
          : 'var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.35s var(--ease-liquid)',
      }}>
        {initial}
      </div>

      <p style={{
        fontFamily: 'Outfit, sans-serif', fontWeight: 600,
        fontSize: '16px', color: '#b3b3cc', margin: 0,
        maxWidth: '120px', textAlign: 'center',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{profile.name}</p>
    </motion.div>
  )
}

const ProfileSelectPage = () => {
  const { user } = useAuth()
  const { profiles, fetchProfiles, selectProfile, setProfiles } = useProfile()
  const navigate = useNavigate()

  const [editMode,    setEditMode]    = useState(false)
  const [showAdd,     setShowAdd]     = useState(false)
  const [newName,     setNewName]     = useState('')
  const [loading,     setLoading]     = useState(false)
  const [fetching,    setFetching]    = useState(true)

  useEffect(() => {
    if (user?.userId) {
      fetchProfiles(user.userId).finally(() => setFetching(false))
    } else {
      setFetching(false)
    }
  }, [user?.userId])

  const handleSelect = (profile) => {
    selectProfile(profile)
    navigate('/home')
  }

  const handleDelete = async (profileId) => {
    try {
      await deleteProfile(profileId)
      setProfiles((prev) => prev.filter((p) => p.id !== profileId))
      toast.success('Profile deleted')
    } catch {
      toast.error('Failed to delete profile')
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setLoading(true)
    try {
      const res = await createProfile(user.userId, { name: newName.trim() })
      setProfiles((prev) => [...prev, res.data.data])
      setNewName('')
      setShowAdd(false)
      toast.success(`Profile "${newName.trim()}" created!`)
    } catch {
      toast.error('Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at center, #12122a 0%, #080810 70%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 800,
          fontSize: 'clamp(28px, 5vw, 52px)',
          color: '#fff', marginBottom: '12px', textAlign: 'center',
        }}
      >
        Who's Watching?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          color: '#666680', fontFamily: 'Inter, sans-serif',
          fontSize: '16px', marginBottom: '56px', textAlign: 'center',
        }}
      >
        Select or create a profile to personalize your experience
      </motion.p>

      {/* Profiles grid */}
      {fetching ? (
        <div style={{ display: 'flex', gap: '32px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              width: '120px', height: '150px',
              background: 'linear-gradient(90deg, #1a1a2e 0%, #242438 50%, #1a1a2e 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '18px',
            }} />
          ))}
          <style>{'@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }'}</style>
        </div>
      ) : (
        <motion.div
          style={{
            display: 'flex', gap: '32px',
            flexWrap: 'wrap', justifyContent: 'center',
            maxWidth: '800px', marginBottom: '48px',
          }}
        >
          <AnimatePresence>
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onSelect={handleSelect}
                onDelete={handleDelete}
                editMode={editMode}
              />
            ))}
          </AnimatePresence>

          {/* Add profile card */}
          {profiles.length < 5 && (
            <motion.div
              whileHover={{ scale: 1.06, y: -6 }}
              onClick={() => setShowAdd(true)}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '14px',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: '120px', height: '120px', borderRadius: '18px',
                background: 'rgba(255,255,255,0.05)',
                border: '2px dashed rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#e50914'
                  e.currentTarget.style.background = 'rgba(229,9,20,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
              >
                <FiPlus size={40} color="rgba(255,255,255,0.4)" />
              </div>
              <p style={{
                fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                fontSize: '16px', color: '#666680', margin: 0,
              }}>Add Profile</p>
            </motion.div>
          )}
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setEditMode((v) => !v)}
        className={editMode ? "liquid-btn-primary" : "liquid-btn-secondary"}
        style={{
          padding: '12px 28px',
          fontSize: '15px',
        }}
      >
        {editMode
          ? <><FiCheck size={16} /> Done Editing</>
          : <><FiEdit2 size={16} /> Manage Profiles</>}
      </motion.button>

      {/* Add profile modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="add-profile-modal-card liquid-glass-dense"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                borderTopColor: 'rgba(255,255,255,0.15)',
                borderRadius: '24px',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <h2 style={{
                fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                fontSize: '22px', color: '#fff', marginBottom: '8px',
              }}>Create Profile</h2>
              <p style={{ color: '#666680', fontSize: '14px', fontFamily: 'Inter, sans-serif', marginBottom: '28px' }}>
                Choose a name for this profile
              </p>
              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Profile name"
                  maxLength={20}
                  className="liquid-input"
                  style={{
                    padding: '14px 18px',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#e50914')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="liquid-btn-secondary"
                    style={{
                      flex: 1, padding: '13px', justifyContent: 'center',
                    }}
                  >Cancel</button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading || !newName.trim()}
                    className="liquid-btn-primary"
                    style={{
                      flex: 1,
                      background: (!newName.trim() || loading) ? 'rgba(229,9,20,0.4)' : '#e50914',
                      padding: '13px', justifyContent: 'center',
                      cursor: (!newName.trim() || loading) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileSelectPage
