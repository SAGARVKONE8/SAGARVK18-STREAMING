import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiUser, FiLogOut, FiSettings,
  FiShield, FiMenu, FiX, FiChevronDown, FiList
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'

import BrandSymbol from '../UI/BrandSymbol'

const PROFILE_COLORS = ['#e50914', '#f5a623', '#00b4d8', '#7209b7', '#06d6a0', '#fb5607']

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const { selectedProfile } = useProfile()
  const [scrolled, setScrolled]         = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const dropdownRef = useRef(null)
  const navigate    = useNavigate()
  const location    = useLocation()

  /* Scroll detection */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  /* Click-outside for dropdown */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { label: 'Home',     path: '/home' },
    { label: 'Movies',   path: '/search?type=MOVIE' },
    { label: 'Series',   path: '/search?type=SERIES' },
    { label: 'My List',  path: '/watchlist' },
  ]

  const profileColor = selectedProfile
    ? PROFILE_COLORS[selectedProfile.id % PROFILE_COLORS.length]
    : '#e50914'

  const profileInitial =
    (selectedProfile?.name?.[0] || user?.name?.[0] || 'U').toUpperCase()

  const isActive = (path) => location.pathname === path.split('?')[0]

  return (
    <>
      {/* ── Inline style for hamburger visibility ── */}
      <style>{`
        .nav-links-desktop { display: flex; }
        .hamburger-btn     { display: none !important; }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .hamburger-btn     { display: flex !important; }
        }
      `}</style>

      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position:     'fixed',
          top: 0, left: 0, right: 0,
          zIndex:       1000,
          height:       '70px',
          padding:      '0 4vw',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
          background:   scrolled
            ? 'rgba(12,12,20,0.55)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          backdropFilter: scrolled ? 'blur(40px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(40px) saturate(180%)' : 'none',
          borderBottom:   scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          borderTop:      scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
          boxShadow:      scrolled ? '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)' : 'none',
          transition:   'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* ── Logo ── */}
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <BrandSymbol size={32} animate={false} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 900,
                fontSize:   '22px',
                background: 'linear-gradient(135deg, #e50914, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '1px',
              }}>SAGARVK18</span>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 300,
                fontSize:   '10px',
                color:      '#888888',
                letterSpacing: '3px',
              }}>STREAMING</span>
            </div>
          </motion.div>
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="nav-links-desktop" style={{ alignItems: 'center', gap: '6px' }}>
          {navLinks.map((lnk) => (
            <Link
              key={lnk.path}
              to={lnk.path}
              style={{
                textDecoration: 'none',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: isActive(lnk.path) ? 600 : 400,
                fontSize:   '14px',
                color:      isActive(lnk.path) ? '#ffffff' : '#a0a0c0',
                padding:    '7px 18px',
                borderRadius: '9999px',
                background: isActive(lnk.path)
                  ? 'rgba(255,255,255,0.08)'
                  : 'transparent',
                border: isActive(lnk.path)
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid transparent',
                backdropFilter: isActive(lnk.path) ? 'blur(12px)' : 'none',
                transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={(e) => {
                if (!isActive(lnk.path)) {
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(lnk.path)) {
                  e.currentTarget.style.color = '#a0a0c0'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {lnk.label}
            </Link>
          ))}
        </div>

        {/* ── Right controls ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search */}
          <motion.button
            whileHover={{ scale: 1.1, color: '#fff' }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate('/search')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#b3b3cc', padding: '8px', borderRadius: '50%',
              display: 'flex', alignItems: 'center',
            }}
          >
            <FiSearch size={20} />
          </motion.button>

          {/* Profile dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDropdownOpen((v) => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${profileColor}, ${profileColor}88)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '15px',
                fontFamily: 'Outfit, sans-serif',
                border: '2px solid rgba(255,255,255,0.18)',
              }}>
                {profileInitial}
              </div>
              <FiChevronDown
                size={14} color="#b3b3cc"
                style={{
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'absolute', top: '52px', right: 0,
                    background: 'rgba(15,15,28,0.65)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderTopColor: 'rgba(255,255,255,0.12)',
                    borderRadius: '20px',
                    padding: '8px',
                    minWidth: '210px',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Header */}
                  <div style={{
                    padding: '12px 14px 14px',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    marginBottom: '6px',
                  }}>
                    <p style={{
                      margin: 0, color: '#fff',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 600, fontSize: '14px',
                    }}>
                      {selectedProfile?.name || user?.name || 'User'}
                    </p>
                    <p style={{ margin: '3px 0 0', color: '#666680', fontSize: '12px' }}>
                      {user?.email}
                    </p>
                  </div>

                  {/* Items */}
                  {[
                    { icon: <FiUser size={15} />,    label: 'Switch Profile', path: '/select-profile' },
                    { icon: <FiSettings size={15} />, label: 'Account',        path: '/account' },
                    { icon: <FiList size={15} />,     label: 'My List',        path: '/watchlist' },
                    ...(isAdmin ? [{ icon: <FiShield size={15} />, label: 'Admin Dashboard', path: '/admin' }] : []),
                  ].map((item) => (
                    <DropdownItem
                      key={item.path}
                      icon={item.icon}
                      label={item.label}
                      onClick={() => { navigate(item.path); setDropdownOpen(false) }}
                    />
                  ))}

                  {/* Sign out */}
                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    marginTop: '6px', paddingTop: '6px',
                  }}>
                    <DropdownItem
                      icon={<FiLogOut size={15} />}
                      label="Sign Out"
                      danger
                      onClick={handleLogout}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hamburger */}
          <motion.button
            className="hamburger-btn"
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#b3b3cc', padding: '8px',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </motion.button>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                position: 'absolute', top: '70px', left: 0, right: 0,
                background: 'rgba(10,10,15,0.98)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                padding: '16px 4vw',
                overflow: 'hidden',
              }}
            >
              {navLinks.map((lnk) => (
                <Link
                  key={lnk.path}
                  to={lnk.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block',
                    color: '#b3b3cc',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '16px',
                    padding: '13px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    textDecoration: 'none',
                  }}
                >
                  {lnk.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

/* ── Helper ── */
const DropdownItem = ({ icon, label, onClick, danger = false }) => (
  <motion.div
    whileHover={{
      backgroundColor: danger ? 'rgba(229,9,20,0.12)' : 'rgba(255,255,255,0.07)',
      x: 2,
    }}
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
      color: danger ? '#e50914' : '#b3b3cc',
      fontSize: '14px', fontFamily: 'Outfit, sans-serif',
    }}
  >
    {icon} {label}
  </motion.div>
)

export default Navbar
