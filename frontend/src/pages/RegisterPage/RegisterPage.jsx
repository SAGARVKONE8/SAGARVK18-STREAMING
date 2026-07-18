import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiAlertCircle, FiCheck } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const getPasswordStrength = (pw) => {
  let score = 0
  if (pw.length >= 8)              score++
  if (/[A-Z]/.test(pw))           score++
  if (/[0-9]/.test(pw))           score++
  if (/[^A-Za-z0-9]/.test(pw))   score++
  return score // 0-4
}

const strengthLabel  = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColor  = ['', '#e50914', '#f5a623', '#00b4d8', '#27ae60']

const RegisterPage = () => {
  const { register, login } = useAuth()
  const navigate            = useNavigate()

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [agreed, setAgreed]   = useState(false)
  const [error, setError]     = useState('')

  const pwStrength = getPasswordStrength(form.password)

  const handleChange = (e) => {
    setError('')
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password) {
      setError('Full name, email, and password are required.')
      return
    }
    if (!agreed) {
      setError('Please accept the terms and conditions.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await register({
        name: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone
      })
      // Auto-login after registration
      await login({ email: form.email, password: form.password })
      toast.success('Account created! Welcome to SAGARVK18 🎬')
      navigate('/select-profile')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
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
      padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-10%',
        width: '550px', height: '550px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(229,9,20,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', left: '-10%',
        width: '450px', height: '450px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="auth-card-responsive"
        style={{ maxWidth: '460px' }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img
              src="/logo.jpg"
              alt="SAGARVK18"
              style={{
                height: '46px',
                borderRadius: '8px',
                objectFit: 'contain',
              }}
            />
          </div>
        </Link>

        <h1 style={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 700,
          fontSize: '24px', color: '#fff', textAlign: 'center', marginBottom: '8px',
        }}>Create Account</h1>
        <p style={{
          color: '#666680', fontSize: '14px', textAlign: 'center',
          fontFamily: 'Inter, sans-serif', marginBottom: '28px',
        }}>Join SAGARVK18 and start streaming</p>

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name */}
          <InputField
            icon={<FiUser size={17} />}
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />

          {/* Email */}
          <InputField
            icon={<FiMail size={17} />}
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />

          {/* Password */}
          <div>
            <label style={{
              color: '#b3b3cc', fontSize: '13px',
              fontFamily: 'Outfit, sans-serif', fontWeight: 500,
              display: 'block', marginBottom: '8px',
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={17} style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: '#666680',
              }} />
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
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
                }}
              >
                {showPw ? <FiEyeOff size={17} /> : <FiEye size={17} />}
              </button>
            </div>

            {/* Password strength indicator */}
            {form.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} style={{
                      flex: 1, height: '4px', borderRadius: '2px',
                      background: n <= pwStrength ? strengthColor[pwStrength] : 'rgba(255,255,255,0.08)',
                      transition: 'background 0.3s ease',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: strengthColor[pwStrength], fontFamily: 'Outfit, sans-serif' }}>
                  {strengthLabel[pwStrength]} password
                </span>
              </div>
            )}
          </div>

          {/* Phone */}
          <InputField
            icon={<FiPhone size={17} />}
            label="Phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
          />

          {/* Terms */}
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            cursor: 'pointer',
          }}>
            <div
              onClick={() => setAgreed((v) => !v)}
              style={{
                width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                background: agreed ? '#e50914' : 'rgba(255,255,255,0.08)',
                border: agreed ? '2px solid #e50914' : '2px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              {agreed && <FiCheck size={13} color="#fff" strokeWidth={3} />}
            </div>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#b3b3cc',
            }}>
              I agree to the{' '}
              <span style={{ color: '#e50914', cursor: 'pointer' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: '#e50914', cursor: 'pointer' }}>Privacy Policy</span>
            </span>
          </label>

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
              marginTop: '4px',
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
                Creating account...
              </>
            ) : 'Create Account 🚀'}
          </motion.button>
        </form>

        {/* Login link */}
        <p style={{
          textAlign: 'center', marginTop: '24px',
          color: '#666680', fontSize: '14px', fontFamily: 'Inter, sans-serif',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#e50914', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

const InputField = ({ icon, label, name, type = 'text', placeholder, required = false, value, onChange, extra }) => (
  <div>
    <label style={{
      color: '#b3b3cc', fontSize: '13px',
      fontFamily: 'Outfit, sans-serif', fontWeight: 500,
      display: 'block', marginBottom: '8px',
    }}>
      {label} {!required && <span style={{ color: '#3a3a55', fontSize: '11px' }}>(optional)</span>}
    </label>
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
        color: '#666680', display: 'flex', alignItems: 'center',
      }}>{icon}</span>
      <input
        type={type} name={name}
        value={value} onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="liquid-input"
        style={{ paddingLeft: '42px', paddingRight: '42px' }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
      />
      {extra && (
        <span style={{
          position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
        }}>{extra}</span>
      )}
    </div>
  </div>
)

export default RegisterPage
