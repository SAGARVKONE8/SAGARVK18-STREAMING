import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiMonitor, FiSmartphone, FiTablet, FiFilm,
  FiUsers, FiStar, FiCheck, FiArrowRight, FiPlay
} from 'react-icons/fi'

const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    price: '₹0',
    period: '/month',
    color: '#888888',
    features: ['720p HD Quality', '2 Screens', 'Ad-supported', '5GB Downloads'],
    popular: false,
  },
  {
    id: 'BASIC',
    name: 'Basic',
    price: '₹199',
    period: '/month',
    color: '#ff6b6b',
    features: ['1080p Full HD', '2 Screens', 'Ad-free', '10GB Downloads'],
    popular: false,
  },
  {
    id: 'STANDARD',
    name: 'Standard',
    price: '₹499',
    period: '/month',
    color: '#ff3333',
    features: ['1080p Full HD', '4 Screens', 'Ad-free', '25GB Downloads', 'Early Access'],
    popular: true,
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: '₹999',
    period: '/month',
    color: '#e50914',
    features: ['4K Ultra HD', '6 Screens', 'Ad-free', 'Unlimited Downloads', 'Early Access', 'Dolby Audio'],
    popular: false,
  },
]

const FEATURES = [
  {
    icon: <FiMonitor size={40} />,
    emoji: '🎬',
    title: 'Watch Anywhere',
    desc: 'Stream on your TV, laptop, tablet, or phone. Your entertainment goes wherever you go.',
  },
  {
    icon: <FiFilm size={40} />,
    emoji: '🎭',
    title: 'New Content Weekly',
    desc: 'Fresh movies and series added every week. Be the first to watch the latest blockbusters.',
  },
  {
    icon: <FiUsers size={40} />,
    emoji: '👨‍👩‍👧',
    title: 'Multiple Profiles',
    desc: 'Create up to 5 profiles per account. Personalized recommendations for the whole family.',
  },
]

const FloatingPoster = ({ delay, duration, left, top, url }) => (
  <motion.div
    className="floating-poster-responsive"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 0.15, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    style={{
      position: 'absolute',
      left, top,
      width: '120px',
      borderRadius: '12px',
      overflow: 'hidden',
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
      zIndex: 0,
    }}
  >
    <img
      src={url}
      alt=""
      style={{ width: '100%', display: 'block', borderRadius: '12px' }}
    />
  </motion.div>
)

const LandingPage = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleGetStarted = (e) => {
    e.preventDefault()
    navigate('/register', { state: { email } })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080810', overflow: 'hidden' }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33%       { transform: translateY(-16px) rotate(1.5deg); }
          66%       { transform: translateY(-8px) rotate(-1.5deg); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 4vw', height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(12,12,20,0.55)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '22px',
            background: 'linear-gradient(135deg, #e50914, #f5a623)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '1px',
          }}>SAGARVK18</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/login" style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 500,
            fontSize: '14px', color: '#a0a0c0', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a0c0')}
          >Sign In</Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="liquid-btn-primary"
              style={{
                padding: '8px 20px', fontSize: '14px',
              }}
            >Get Started</motion.button>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: '70px', overflow: 'hidden',
      }}>
        {/* Animated background gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(229,9,20,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(245,166,35,0.08) 0%, transparent 60%), linear-gradient(135deg, #0a0a0f 0%, #12122a 50%, #0a0a0f 100%)',
          zIndex: 0,
        }} />

        {/* Floating posters */}
        {[
          { delay: 0.3, duration: 5,   left: '3%',  top: '15%', url: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg' }, // Inception
          { delay: 0.6, duration: 6.5, left: '10%', top: '60%', url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' }, // The Dark Knight
          { delay: 0.2, duration: 4.5, left: '80%', top: '20%', url: 'https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg' }, // Breaking Bad
          { delay: 0.8, duration: 7,   left: '88%', top: '60%', url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg' }, // Avengers: Endgame
          { delay: 1.0, duration: 5.5, left: '70%', top: '70%', url: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' }, // Stranger Things
        ].map((p, i) => <FloatingPoster key={i} {...p} />)}

        {/* Hero content */}
        <div style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', maxWidth: '780px',
          padding: '0 24px',
        }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(229,9,20,0.12)',
              border: '1px solid rgba(229,9,20,0.25)',
              borderRadius: '20px', padding: '6px 18px',
              marginBottom: '28px',
              fontFamily: 'Outfit, sans-serif', fontSize: '13px',
              color: '#e50914', fontWeight: 600, letterSpacing: '0.5px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e50914', animation: 'pulse 2s infinite' }} />
            Now Streaming — HD & 4K
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 900,
              fontSize: 'clamp(32px, 7vw, 90px)',
              lineHeight: 1.05, margin: '0 0 20px',
              background: 'linear-gradient(135deg, #ffffff 0%, #e50914 50%, #f5a623 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}
          >
            SAGARVK18
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700,
              fontSize: 'clamp(20px, 3.5vw, 36px)',
              color: '#ffffff', margin: '0 0 16px',
            }}
          >
            Unlimited Movies. Series. More.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: '17px',
              color: '#b3b3cc', margin: '0 0 44px', lineHeight: 1.6,
            }}
          >
            Stream in HD &amp; 4K. Watch anywhere. Cancel anytime.
          </motion.p>

          {/* Email CTA */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            onSubmit={handleGetStarted}
            className="responsive-cta-form"
          >
            <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="liquid-input"
                style={{
                  paddingLeft: '20px',
                  borderRadius: '9999px',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="liquid-btn-primary"
              style={{
                padding: '14px 32px', fontSize: '16px',
                whiteSpace: 'nowrap',
              }}
            >
              Get Started <FiArrowRight size={18} />
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}
          >
            {['No commitments', 'Cancel anytime', 'Ad-free premium'].map((t) => (
              <span key={t} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: '#666680', fontSize: '13px', fontFamily: 'Inter, sans-serif',
              }}>
                <FiCheck size={14} color="#27ae60" /> {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section style={{
        padding: '100px 4vw',
        background: 'linear-gradient(180deg, #080810 0%, #12122a 50%, #080810 100%)',
      }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center', fontFamily: 'Outfit, sans-serif',
            fontWeight: 800, fontSize: 'clamp(28px, 4vw, 48px)',
            color: '#fff', marginBottom: '16px',
          }}
        >Why Choose SAGARVK18?</motion.h2>
        <p style={{
          textAlign: 'center', color: '#666680',
          fontFamily: 'Inter, sans-serif', fontSize: '16px',
          marginBottom: '64px',
        }}>Everything you need for the perfect streaming experience</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px', maxWidth: '1100px', margin: '0 auto',
        }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: '0 24px 60px rgba(229,9,20,0.12)' }}
              className="liquid-glass-card"
              style={{
                borderRadius: '24px',
                padding: '40px 32px',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontSize: '52px', marginBottom: '20px',
                filter: 'drop-shadow(0 0 20px rgba(229,9,20,0.3))',
              }}>
                {f.emoji}
              </div>
              <h3 style={{
                fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                fontSize: '22px', color: '#fff', marginBottom: '12px',
              }}>{f.title}</h3>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '15px',
                color: '#b3b3cc', lineHeight: 1.7,
              }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Plans Section ── */}
      <section style={{ padding: '100px 4vw', background: '#080810' }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center', fontFamily: 'Outfit, sans-serif',
            fontWeight: 800, fontSize: 'clamp(28px, 4vw, 48px)',
            color: '#fff', marginBottom: '16px',
          }}
        >Choose Your Plan</motion.h2>
        <p style={{
          textAlign: 'center', color: '#666680',
          fontFamily: 'Inter, sans-serif', fontSize: '16px',
          marginBottom: '64px',
        }}>Start free or unlock premium features</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '20px', maxWidth: '1100px', margin: '0 auto',
        }}>
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, boxShadow: `0 28px 70px ${plan.color}22` }}
              className="liquid-glass-card"
              style={{
                position: 'relative',
                border: plan.popular
                  ? `2px solid ${plan.color}`
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                padding: '36px 28px',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.color, color: '#fff',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                  fontSize: '12px', padding: '5px 18px',
                  borderRadius: '20px', whiteSpace: 'nowrap',
                  letterSpacing: '0.5px',
                }}>
                  ⭐ MOST POPULAR
                </div>
              )}

              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '48px', height: '48px', borderRadius: '14px',
                background: `${plan.color}22`,
                border: `1px solid ${plan.color}44`,
                marginBottom: '20px',
              }}>
                <FiPlay size={22} color={plan.color} fill={plan.color} />
              </div>

              <h3 style={{
                fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                fontSize: '20px', color: '#fff', marginBottom: '8px',
              }}>{plan.name}</h3>

              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  fontFamily: 'Outfit, sans-serif', fontWeight: 900,
                  fontSize: '38px', color: plan.color,
                }}>{plan.price}</span>
                <span style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '14px',
                  color: '#666680',
                }}>{plan.period}</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                {plan.features.map((f) => (
                  <li key={f} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontFamily: 'Inter, sans-serif', fontSize: '14px',
                    color: '#b3b3cc', marginBottom: '10px',
                  }}>
                    <FiCheck size={15} color={plan.color} /> {f}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/register')}
                className={plan.popular ? "liquid-btn-primary" : "liquid-btn-secondary"}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: plan.popular ? plan.color : 'transparent',
                  border: `2px solid ${plan.color}`,
                  color: plan.popular ? '#fff' : plan.color,
                  borderRadius: '9999px',
                  padding: '13px',
                }}
              >
                {plan.id === 'FREE' ? 'Get Started Free' : `Choose ${plan.name}`}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{
        padding: '80px 4vw',
        background: 'linear-gradient(135deg, rgba(229,9,20,0.1), rgba(245,166,35,0.05))',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
      }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 900,
            fontSize: 'clamp(28px, 4vw, 50px)', color: '#fff',
            marginBottom: '16px',
          }}
        >Ready to Watch?</motion.h2>
        <p style={{
          color: '#b3b3cc', fontFamily: 'Inter, sans-serif',
          fontSize: '17px', marginBottom: '36px',
        }}>
          Join millions of viewers. Start your journey today.
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/register')}
          className="liquid-btn-primary"
          style={{
            padding: '18px 44px', fontSize: '18px',
          }}
        >
          Start Watching Now 🎬
        </motion.button>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '48px 4vw',
        background: '#080810',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: '32px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <img src="/logo.png" alt="Logo" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
                <div style={{
                  fontFamily: 'Outfit, sans-serif', fontWeight: 900,
                  fontSize: '24px',
                  background: 'linear-gradient(135deg, #e50914, #f5a623)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>SAGARVK18</div>
              </div>
              <p style={{ color: '#666680', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                Your premium streaming destination.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              {[
                { label: 'Legal', links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy'] },
                { label: 'Company', links: ['About Us', 'Careers', 'Contact'] },
                { label: 'Support', links: ['Help Center', 'Account', 'Accessibility'] },
              ].map((col) => (
                <div key={col.label}>
                  <p style={{
                    color: '#b3b3cc', fontFamily: 'Outfit, sans-serif',
                    fontWeight: 600, fontSize: '13px', marginBottom: '12px',
                    textTransform: 'uppercase', letterSpacing: '0.8px',
                  }}>{col.label}</p>
                  {col.links.map((l) => (
                    <p key={l} style={{
                      color: '#666680', fontFamily: 'Inter, sans-serif',
                      fontSize: '13px', marginBottom: '8px', cursor: 'pointer',
                    }}>{l}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '24px',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '12px',
          }}>
            <p style={{ color: '#3a3a55', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
              © 2024 SAGARVK18 STREAMING. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['🇮🇳 India', '🌐 Global'].map((t) => (
                <span key={t} style={{ color: '#3a3a55', fontSize: '13px' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
