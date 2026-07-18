import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUser, FiCreditCard, FiShield, FiUsers, FiLogOut,
  FiEdit2, FiTrash2, FiPlus, FiCheck, FiX, FiDollarSign
} from 'react-icons/fi'
import Navbar from '../../components/Navbar/Navbar'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'
import {
  getPayments, subscribe, createProfile, deleteProfile, updateProfile, changePassword
} from '../../api/userApi'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const PLANS = [
  {
    id: 'FREE',    dbId: 1, name: 'Free',     price: '₹0',   color: '#27ae60',
    features: ['720p HD', '2 Screens', 'Ad-supported'],
  },
  {
    id: 'BASIC',   dbId: 2, name: 'Basic',    price: '₹149', color: '#00b4d8',
    features: ['1080p Full HD', '2 Screens', 'Ad-free'],
  },
  {
    id: 'STANDARD',dbId: 3, name: 'Standard', price: '₹349', color: '#f5a623',
    features: ['1080p Full HD', '4 Screens', 'Early Access'],
    popular: true,
  },
  {
    id: 'PREMIUM', dbId: 4, name: 'Premium',  price: '₹649', color: '#e50914',
    features: ['4K Ultra HD', '6 Screens', 'Dolby Audio', 'Unlimited Downloads'],
  },
]

const TABS = ['Account', 'Subscription', 'Profiles', 'Payments', 'Security']

const AccountPage = () => {
  const { user, logout, updateSubscription } = useAuth()
  const { profiles, fetchProfiles, setProfiles } = useProfile()
  const navigate = useNavigate()

  const [tab,          setTab]          = useState('Account')
  const [payments,     setPayments]     = useState([])
  const [loading,      setLoading]      = useState(false)
  const [subscribing,  setSubscribing]  = useState(null)
  const [editProfile,  setEditProfile]  = useState(null)
  const [editName,     setEditName]     = useState('')
  const [showAddPro,   setShowAddPro]   = useState(false)
  const [newProName,   setNewProName]   = useState('')
  const [showPayment,  setShowPayment]  = useState(null)
  const [payCard,      setPayCard]      = useState({ number: '', expiry: '', cvv: '' })

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [updatingPass,    setUpdatingPass]    = useState(false)

  useEffect(() => {
    if (user?.userId) {
      fetchProfiles(user.userId)
      getPayments(user.userId)
        .then((r) => setPayments(Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : []))
        .catch(() => {})
    }
  }, [user?.userId])

  const handleSubscribe = async (planId) => {
    const selectedPlan = PLANS.find((p) => p.id === planId)
    if (!selectedPlan) return
    if (!showPayment) { setShowPayment(planId); return }

    // Validate banking details before sending request
    const cleanCard = payCard.number.replace(/\s+/g, '')
    if (!/^\d{16}$/.test(cleanCard)) {
      toast.error('Please enter a valid 16-digit card number')
      return
    }
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(payCard.expiry)) {
      toast.error('Please enter expiry date in MM/YY format')
      return
    }
    if (!/^\d{3}$/.test(payCard.cvv)) {
      toast.error('Please enter a valid 3-digit CVV')
      return
    }

    setSubscribing(planId)
    try {
      await subscribe(user.userId, {
        planId: selectedPlan.dbId,
        paymentMethod: 'CARD',
        cardNumber: cleanCard,
        expiry: payCard.expiry,
        cvv: payCard.cvv,
      })
      updateSubscription?.(planId)
      toast.success(`Subscribed to ${planId} plan! 🎉`)
      setShowPayment(null)
      // Reset card details
      setPayCard({ number: '', expiry: '', cvv: '' })

      // Reload payment history
      getPayments(user.userId)
        .then((r) => setPayments(Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : []))
        .catch(() => {})
    } catch {
      toast.error('Payment failed. Please try again.')
    } finally {
      setSubscribing(null)
    }
  }

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setUpdatingPass(true)
    try {
      await changePassword(user.userId, { currentPassword, newPassword })
      toast.success('Password updated successfully! 🔐')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed')
    } finally {
      setUpdatingPass(false)
    }
  }

  const handleDeleteProfile = async (id) => {
    try {
      await deleteProfile(id)
      setProfiles((prev) => prev.filter((p) => p.id !== id))
      toast.success('Profile deleted')
    } catch { toast.error('Failed to delete profile') }
  }

  const handleEditProfile = async () => {
    if (!editName.trim() || !editProfile) return
    try {
      const res = await updateProfile(editProfile.id, { name: editName.trim() })
      setProfiles((prev) => prev.map((p) => p.id === editProfile.id ? res.data.data : p))
      setEditProfile(null)
      toast.success('Profile updated')
    } catch { toast.error('Failed to update profile') }
  }

  const handleAddProfile = async () => {
    if (!newProName.trim()) return
    try {
      const res = await createProfile(user.userId, { name: newProName.trim() })
      setProfiles((prev) => [...prev, res.data.data])
      setNewProName(''); setShowAddPro(false)
      toast.success('Profile created!')
    } catch { toast.error('Failed to create profile') }
  }

  if (!user) return <LoadingSpinner />

  const subColor = PLANS.find((p) => p.id === user.subscriptionType)?.color || '#666680'

  return (
    <div style={{ minHeight: '100vh', background: '#080810' }}>
      <Navbar />

      <div style={{ padding: '100px 4vw 60px', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Page heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 800,
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            color: '#fff', marginBottom: '32px',
          }}
        >Account Settings</motion.h1>

        {/* Tabs */}
        <div className="tabs-scrollable" style={{ display: 'flex', gap: '8px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="liquid-badge"
              style={{
                flex: 1, minWidth: '90px',
                padding: '10px 16px',
                background: tab === t
                  ? 'linear-gradient(135deg, var(--accent-red), #ff2d3a)'
                  : 'rgba(255,255,255,0.04)',
                color: tab === t ? '#fff' : '#a0a0c0',
                borderColor: tab === t
                  ? 'rgba(229,9,20,0.4)'
                  : 'rgba(255,255,255,0.08)',
                cursor: 'pointer',
                boxShadow: tab === t
                  ? '0 4px 24px rgba(229,9,20,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >{t}</button>
          ))}
        </div>

        {/* ── Account tab ── */}
        {tab === 'Account' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="liquid-glass-card" style={{
              padding: '36px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px',
                  background: 'linear-gradient(135deg, #e50914, #f5a623)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', fontWeight: 900, color: '#fff',
                  fontFamily: 'Outfit, sans-serif',
                }}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '22px', color: '#fff', margin: 0 }}>
                    {user.name}
                  </h2>
                  <p style={{ color: '#666680', fontFamily: 'Inter, sans-serif', fontSize: '14px', margin: '4px 0 0' }}>
                    {user.email}
                  </p>
                  <span style={{
                    display: 'inline-block', marginTop: '8px',
                    background: `${subColor}22`,
                    border: `1px solid ${subColor}44`,
                    color: subColor,
                    fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                    fontSize: '12px', padding: '4px 14px', borderRadius: '20px',
                  }}>
                    {user.subscriptionType || 'FREE'} Plan
                  </span>
                </div>
              </div>

              {[
                { label: 'Full Name', value: user.name || '—' },
                { label: 'Email Address', value: user.email || '—' },
                { label: 'Account Role', value: user.role || 'USER' },
                { label: 'Member Since', value: '2024' },
              ].map((item) => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ color: '#666680', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>{item.label}</span>
                  <span style={{ color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '14px' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Sign out */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { logout(); navigate('/') }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(229,9,20,0.1)',
                border: '1px solid rgba(229,9,20,0.25)',
                color: '#e50914', borderRadius: '14px',
                padding: '14px 28px', fontSize: '15px',
                fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              <FiLogOut size={18} /> Sign Out
            </motion.button>
          </motion.div>
        )}

        {/* ── Subscription tab ── */}
        {tab === 'Subscription' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p style={{ color: '#b3b3cc', fontFamily: 'Inter, sans-serif', fontSize: '15px', marginBottom: '28px' }}>
              Current plan: <strong style={{ color: subColor }}>{user.subscriptionType || 'FREE'}</strong>
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '18px', marginBottom: '28px',
            }}>
              {PLANS.map((plan, i) => {
                const isCurrent = user.subscriptionType === plan.id
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, ease: 'easeOut' }}
                    whileHover={{ y: -4 }}
                    className="liquid-glass-card"
                    style={{
                      border: isCurrent ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '22px', padding: '28px 22px',
                      position: 'relative',
                    }}
                  >
                    {isCurrent && (
                      <div style={{
                        position: 'absolute', top: '-12px', right: '16px',
                        background: plan.color, color: '#fff',
                        fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                        fontSize: '11px', padding: '4px 14px', borderRadius: '20px',
                      }}>CURRENT</div>
                    )}
                    <h3 style={{ color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '6px' }}>
                      {plan.name}
                    </h3>
                    <p style={{ color: plan.color, fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '30px', marginBottom: '16px' }}>
                      {plan.price}<span style={{ fontSize: '14px', color: '#666680' }}>/mo</span>
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                      {plan.features.map((f) => (
                        <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b3b3cc', fontSize: '13px', marginBottom: '8px' }}>
                          <FiCheck size={13} color={plan.color} /> {f}
                        </li>
                      ))}
                    </ul>
                    {!isCurrent && (
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleSubscribe(plan.id)}
                        className="liquid-btn-primary"
                        style={{
                          width: '100%', background: plan.color,
                          justifyContent: 'center', padding: '12px',
                          borderRadius: '9999px',
                        }}
                      >
                        {subscribing === plan.id ? 'Processing…' : `Switch to ${plan.name}`}
                      </motion.button>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Payment form */}
            <AnimatePresence>
              {showPayment && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="liquid-glass-card"
                  style={{
                    border: '1px solid rgba(245,166,35,0.3)',
                    borderRadius: '20px', padding: '28px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '18px', margin: 0 }}>
                      <FiDollarSign size={18} style={{ marginRight: '8px' }} />
                      Payment Details
                    </h3>
                    <button onClick={() => setShowPayment(null)} style={{ background: 'none', border: 'none', color: '#666680', cursor: 'pointer' }}>
                      <FiX size={20} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    {[
                      { key: 'number', label: 'Card Number', placeholder: '1234 5678 9012 3456', colSpan: '1 / -1' },
                      { key: 'expiry', label: 'Expiry (MM/YY)', placeholder: '12/26' },
                      { key: 'cvv', label: 'CVV', placeholder: '***' },
                    ].map((f) => (
                      <div key={f.key} style={{ gridColumn: f.colSpan }}>
                        <label style={{ color: '#b3b3cc', fontSize: '12px', fontFamily: 'Outfit, sans-serif', display: 'block', marginBottom: '6px' }}>
                          {f.label}
                        </label>
                        <input
                          value={payCard[f.key]}
                          onChange={(e) => setPayCard((prev) => ({ ...prev, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="liquid-input"
                          style={{
                            padding: '12px 14px',
                          }}
                          onFocus={(e) => (e.target.style.borderColor = '#f5a623')}
                          onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                        />
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSubscribe(showPayment)}
                    disabled={!!subscribing}
                    className="liquid-btn-primary"
                    style={{
                      marginTop: '20px', width: '100%',
                      background: '#f5a623', color: '#000',
                      justifyContent: 'center', padding: '14px',
                      cursor: subscribing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {subscribing ? 'Processing…' : '💳 Confirm Payment'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Profiles tab ── */}
        {tab === 'Profiles' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {profiles.map((p) => (
                <div key={p.id} className="liquid-glass-card" style={{
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  minWidth: '240px',
                  borderRadius: '18px',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #e50914, #f5a623)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 900, fontSize: '20px',
                    fontFamily: 'Outfit, sans-serif',
                  }}>
                    {p.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px', margin: 0 }}>{p.name}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => { setEditProfile(p); setEditName(p.name) }}
                      style={{
                        background: 'rgba(255,255,255,0.08)', border: 'none',
                        borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#b3b3cc',
                      }}
                    ><FiEdit2 size={14} /></button>
                    <button
                      onClick={() => handleDeleteProfile(p.id)}
                      style={{
                        background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)',
                        borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#e50914',
                      }}
                    ><FiTrash2 size={14} /></button>
                  </div>
                </div>
              ))}

              {profiles.length < 5 && (
                <motion.button
                  whileHover={{ scale: 1.04, background: 'rgba(229,9,20,0.08)' }}
                  onClick={() => setShowAddPro(true)}
                  style={{
                    background: 'transparent',
                    border: '2px dashed rgba(255,255,255,0.15)',
                    borderRadius: '18px', padding: '20px 24px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    cursor: 'pointer', color: '#666680',
                    fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                    fontSize: '15px', minWidth: '200px',
                    transition: 'all 0.2s',
                  }}
                >
                  <FiPlus size={20} /> Add Profile
                </motion.button>
              )}
            </div>

            {/* Edit profile inline */}
            <AnimatePresence>
              {editProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="liquid-glass-card"
                  style={{
                    border: '1px solid rgba(245,166,35,0.3)',
                    borderRadius: '18px', padding: '24px',
                    display: 'flex', gap: '12px', alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="liquid-input"
                    style={{
                      flex: 1, minWidth: '200px',
                      padding: '12px 16px',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#f5a623')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                  <button onClick={handleEditProfile} className="liquid-btn-primary" style={{
                    background: '#f5a623', color: '#000',
                    padding: '12px 22px', fontSize: '14px',
                  }}>Save</button>
                  <button onClick={() => setEditProfile(null)} className="liquid-btn-secondary" style={{
                    padding: '12px 18px',
                  }}>Cancel</button>
                </motion.div>
              )}
              {showAddPro && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="liquid-glass-card"
                  style={{
                    border: '1px solid rgba(229,9,20,0.3)',
                    borderRadius: '18px', padding: '24px',
                    display: 'flex', gap: '12px', alignItems: 'center',
                    flexWrap: 'wrap', marginTop: '16px',
                  }}
                >
                  <input
                    autoFocus
                    value={newProName}
                    onChange={(e) => setNewProName(e.target.value)}
                    placeholder="Profile name"
                    maxLength={20}
                    className="liquid-input"
                    style={{
                      flex: 1, minWidth: '200px',
                      padding: '12px 16px',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#e50914')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                  <button onClick={handleAddProfile} className="liquid-btn-primary" style={{
                    padding: '12px 22px', fontSize: '14px',
                  }}>Create</button>
                  <button onClick={() => setShowAddPro(false)} className="liquid-btn-secondary" style={{
                    padding: '12px 18px',
                  }}>Cancel</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Payments tab ── */}
        {tab === 'Payments' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {payments.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                <span style={{ fontSize: '60px', opacity: 0.3 }}>💳</span>
                <p style={{ color: '#b3b3cc', fontFamily: 'Outfit, sans-serif', fontSize: '18px', marginTop: '16px' }}>
                  No payment history yet
                </p>
              </div>
            ) : (
              <div className="liquid-glass-card" style={{
                borderRadius: '20px', overflow: 'hidden',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#1a1a2e' }}>
                      {['Date', 'Plan', 'Amount', 'Status'].map((h) => (
                        <th key={h} style={{
                          padding: '14px 20px', textAlign: 'left',
                          color: '#666680', fontFamily: 'Outfit, sans-serif',
                          fontSize: '12px', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.8px',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '14px 20px', color: '#b3b3cc', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
                          {new Date(p.paidAt || p.date || p.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '14px 20px', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                          {p.plan?.name || p.planId || p.plan}
                        </td>
                        <td style={{ padding: '14px 20px', color: '#f5a623', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                          ₹{p.amount}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            background: 'rgba(39,174,96,0.15)',
                            border: '1px solid rgba(39,174,96,0.3)',
                            color: '#27ae60',
                            padding: '3px 10px', borderRadius: '20px',
                            fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                          }}>
                            {p.status || 'PAID'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Security tab ── */}
        {tab === 'Security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="liquid-glass-card" style={{
              padding: '36px',
              borderRadius: '24px',
            }}>
              <h3 style={{ color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '20px', marginBottom: '24px' }}>
                <FiShield size={20} style={{ marginRight: '10px' }} />
                Security Settings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '440px' }}>
                <div>
                  <label style={{ color: '#b3b3cc', fontSize: '13px', fontFamily: 'Outfit, sans-serif', display: 'block', marginBottom: '8px' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="liquid-input"
                    style={{
                      padding: '13px 16px',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#e50914')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
                <div>
                  <label style={{ color: '#b3b3cc', fontSize: '13px', fontFamily: 'Outfit, sans-serif', display: 'block', marginBottom: '8px' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="liquid-input"
                    style={{
                      padding: '13px 16px',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#e50914')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
                <div>
                  <label style={{ color: '#b3b3cc', fontSize: '13px', fontFamily: 'Outfit, sans-serif', display: 'block', marginBottom: '8px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="liquid-input"
                    style={{
                      padding: '13px 16px',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#e50914')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePasswordChange}
                  disabled={updatingPass}
                  className="liquid-btn-primary"
                  style={{
                    background: updatingPass ? '#888' : '#e50914',
                    justifyContent: 'center', padding: '14px',
                    marginTop: '8px',
                  }}
                >
                  {updatingPass ? 'Updating...' : 'Update Password'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AccountPage
