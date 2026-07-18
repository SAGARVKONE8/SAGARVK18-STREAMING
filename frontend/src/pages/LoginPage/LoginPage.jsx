import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import BrandSymbol from '../../components/UI/BrandSymbol'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) => {
    setError('')
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back! 🎬')
      navigate('/select-profile')
    } catch (err) {
      let msg = 'Invalid credentials. Please try again.'
      if (err.response) {
        msg = err.response.data?.message || msg
      } else if (err.request) {
        msg = 'Connection error: Backend server is unreachable. Verify your Render backend is running and VITE_API_BASE_URL is correct.'
      } else {
        msg = err.message
      }
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080810',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(229,9,20,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="auth-card-responsive"
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', gap: '8px' }}
          >
            <BrandSymbol size={48} />
            <div>
              <span style={{
                fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '28px',
                background: 'linear-gradient(135deg, #e50914, #ffd700)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '1px',
              }}>SAGARVK18</span>
              <p style={{ color: '#888888', fontSize: '11px', fontFamily: 'Outfit, sans-serif', letterSpacing: '4px', marginTop: '4px', textAlign: 'center', margin: 0 }}>
                STREAMING
              </p>
            </div>
          </motion.div>
        </Link>

        <h1 style={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 700,
          fontSize: '26px', color: '#fff', textAlign: 'center',
          marginBottom: '8px',
        }}>Welcome Back</h1>
        <p style={{
          color: '#666680', fontSize: '14px', textAlign: 'center',
          fontFamily: 'Inter, sans-serif', marginBottom: '32px',
        }}>Sign in to continue watching</p>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(229,9,20,0.1)',
              border: '1px solid rgba(229,9,20,0.3)',
              borderRadius: '12px', padding: '12px 16px',
              marginBottom: '20px',
              color: '#e50914', fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <FiAlertCircle size={16} /> {error}
          </motion.div>
        )}


        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Email */}
          <div>
            <label style={{ color: '#b3b3cc', fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail size={17} style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: '#666680',
              }} />
              <input
                type="email" name="email"
                value={form.email} onChange={handleChange}
                placeholder="your@email.com"
                required
                className="liquid-input"
                style={{ paddingLeft: '42px' }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ color: '#b3b3cc', fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock size={17} style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: '#666680',
              }} />
              <input
                type={showPw ? 'text' : 'password'} name="password"
                value={form.password} onChange={handleChange}
                placeholder="Enter your password"
                required
                className="liquid-input"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#666680',
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPw ? <FiEyeOff size={17} /> : <FiEye size={17} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: 'right', marginTop: '-8px' }}>
            <span
              onClick={() => toast('Password reset coming soon!', { icon: '🔧' })}
              style={{
                color: '#666680', fontSize: '13px',
                fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              }}
            >
              Forgot Password?
            </span>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 8px 40px rgba(229,9,20,0.5)' }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="liquid-btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '15px',
              fontSize: '16px',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  animation: 'spin 0.8s linear infinite',
                  display: 'inline-block',
                }} />
                <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
                Signing in...
              </>
            ) : 'Sign In'}
          </motion.button>
        </form>

        {/* Register link */}
        <p style={{
          textAlign: 'center', marginTop: '24px',
          color: '#666680', fontSize: '14px', fontFamily: 'Inter, sans-serif',
        }}>
          New to SAGARVK18?{' '}
          <Link to="/register" style={{ color: '#e50914', fontWeight: 600, textDecoration: 'none' }}>
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default LoginPage
