import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilm, FiUsers, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiStar, FiEye, FiShield } from 'react-icons/fi';
import { MdMovieFilter, MdLiveTv } from 'react-icons/md';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar/Navbar';
import { adminGetUsers, adminCreateContent, adminUpdateContent, adminDeleteContent, adminUpdateRole } from '../../api/adminApi';
import { getAllContent, getGenres } from '../../api/contentApi';

const initialForm = {
  title: '', description: '', type: 'MOVIE', language: 'English',
  releaseYear: new Date().getFullYear(), rating: 7.0, posterUrl: '',
  backdropUrl: '', trailerUrl: '', videoUrl: '', duration: 120,
  isPremium: false, cast: '', director: '', ageRating: 'PG-13', genreIds: []
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('content');
  const [contents, setContents] = useState([]);
  const [users, setUsers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contentRes, usersRes, genreRes] = await Promise.all([
        getAllContent(0, 100),
        adminGetUsers(),
        getGenres()
      ]);
      setContents(contentRes.data?.data || []);
      setUsers(usersRes.data?.data || []);
      setGenres(genreRes.data?.data || []);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingContent(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEditModal = (content) => {
    setEditingContent(content);
    setForm({
      title: content.title || '',
      description: content.description || '',
      type: content.type || 'MOVIE',
      language: content.language || 'English',
      releaseYear: content.releaseYear || new Date().getFullYear(),
      rating: content.rating || 7.0,
      posterUrl: content.posterUrl || '',
      backdropUrl: content.backdropUrl || '',
      trailerUrl: content.trailerUrl || '',
      videoUrl: content.videoUrl || '',
      duration: content.duration || 120,
      isPremium: content.premium || content.isPremium || false,
      cast: content.cast || '',
      director: content.director || '',
      ageRating: content.ageRating || 'PG-13',
      genreIds: content.genres?.map(g => g.id) || []
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingContent) {
        await adminUpdateContent(editingContent.id, form);
        toast.success('Content updated!');
      } else {
        await adminCreateContent(form);
        toast.success('Content created!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteContent(id);
      toast.success('Content deleted');
      setDeleteConfirm(null);
      fetchData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await adminUpdateRole(userId, newRole);
      toast.success('Role updated');
      fetchData();
    } catch {
      toast.error('Role update failed');
    }
  };

  const toggleGenre = (id) => {
    setForm(prev => ({
      ...prev,
      genreIds: prev.genreIds.includes(id)
        ? prev.genreIds.filter(g => g !== id)
        : [...prev.genreIds, id]
    }));
  };

  const stats = [
    { label: 'Total Content', value: contents.length, icon: <FiFilm />, color: '#e50914' },
    { label: 'Movies', value: contents.filter(c => c.type === 'MOVIE').length, icon: <MdMovieFilter />, color: '#ff3333' },
    { label: 'Series', value: contents.filter(c => c.type === 'SERIES').length, icon: <MdLiveTv />, color: '#ff6b6b' },
    { label: 'Total Users', value: users.length, icon: <FiUsers />, color: '#888888' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#fff' }}>
      <Navbar />
      <div style={{ padding: '80px 4vw 40px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <FiShield size={28} color="#e50914" />
            <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', fontWeight: 800 }}>
              Admin <span style={{ color: '#e50914' }}>Dashboard</span>
            </h1>
          </div>
          <p style={{ color: '#888', fontFamily: 'Inter' }}>Manage all content and users for SAGARVK18 STREAMING</p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="liquid-glass-card"
              style={{
                border: `1px solid ${stat.color}22`, borderRadius: '16px', padding: '24px',
                display: 'flex', alignItems: 'center', gap: '16px'
              }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `${stat.color}15`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: stat.color, fontSize: '22px',
                border: `1px solid ${stat.color}33`,
              }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: '#a0a0c0' }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content', backdropFilter: 'blur(10px)' }}>
          {['content', 'users'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 24px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                background: activeTab === tab ? 'linear-gradient(135deg, var(--accent-red), #ff2d3a)' : 'transparent',
                color: activeTab === tab ? '#fff' : '#a0a0c0',
                fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.9rem',
                textTransform: 'capitalize', transition: 'all 0.35s var(--ease-liquid)',
                boxShadow: activeTab === tab ? '0 4px 20px rgba(229,9,20,0.25), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
              }}>
              {tab === 'content' ? '🎬 Content' : '👥 Users'}
            </button>
          ))}
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 700 }}>Content Library ({contents.length})</h2>
              <button onClick={openAddModal} className="liquid-btn-primary" style={{
                padding: '10px 20px', fontSize: '0.9rem',
              }}>
                <FiPlus /> Add Content
              </button>
            </div>

            <div className="admin-table-container" style={{
              background: 'rgba(14,14,28,0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-glass)',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Poster', 'Title', 'Type', 'Year', 'Rating', 'Language', 'Premium', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#a0a0c0', fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contents.map((content, i) => (
                    <motion.tr key={content.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.35s var(--ease-liquid)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 16px' }}>
                        <img src={content.posterUrl} alt={content.title}
                          style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '6px', background: '#222' }}
                          onError={e => e.target.style.display = 'none'} />
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'Outfit', fontWeight: 600, maxWidth: '200px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{content.title}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="liquid-badge" style={{
                          padding: '4px 10px', fontSize: '0.75rem',
                          background: content.type === 'MOVIE' ? 'rgba(229,9,20,0.1)' : 'rgba(108,99,255,0.1)',
                          borderColor: content.type === 'MOVIE' ? 'rgba(229,9,20,0.25)' : 'rgba(108,99,255,0.25)',
                          color: content.type === 'MOVIE' ? '#e50914' : '#9b8fff'
                        }}>{content.type}</span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#a0a0c0' }}>{content.releaseYear}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f5a623' }}>
                          <FiStar size={12} fill="#f5a623" /> {content.rating?.toFixed(1) || 'N/A'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#a0a0c0' }}>{content.language}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: (content.premium || content.isPremium) ? '#f5a623' : '#a0a0c0', fontWeight: 600, fontSize: '0.8rem' }}>
                          {(content.premium || content.isPremium) ? '👑 Yes' : 'No'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => openEditModal(content)}
                            style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.2)', padding: '7px', borderRadius: '8px', color: '#f5a623', cursor: 'pointer', display: 'flex' }}>
                            <FiEdit2 size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirm(content.id)}
                            style={{ background: 'rgba(229,9,20,0.12)', border: '1px solid rgba(229,9,20,0.2)', padding: '7px', borderRadius: '8px', color: '#e50914', cursor: 'pointer', display: 'flex' }}>
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '16px' }}>User Management ({users.length})</h2>
            <div className="admin-table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Name', 'Email', 'Subscription', 'Role', 'Joined'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#888', fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 16px', fontFamily: 'Outfit', fontWeight: 600 }}>{user.name}</td>
                      <td style={{ padding: '14px 16px', color: '#aaa', fontSize: '0.9rem' }}>{user.email}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                          background: user.subscriptionType === 'PREMIUM' ? '#f5a62333' : user.subscriptionType === 'STANDARD' ? '#6c63ff33' : '#88888833',
                          color: user.subscriptionType === 'PREMIUM' ? '#f5a623' : user.subscriptionType === 'STANDARD' ? '#9b8fff' : '#888'
                        }}>{user.subscriptionType}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                          background: user.role === 'ADMIN' ? '#e5091422' : '#ffffff11',
                          color: user.role === 'ADMIN' ? '#e50914' : '#ccc' }}>{user.role}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#888', fontSize: '0.85rem' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
            }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="admin-modal-card liquid-glass-dense"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                borderTopColor: 'rgba(255,255,255,0.15)',
                borderRadius: '24px',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem' }}>
                  {editingContent ? '✏️ Edit Content' : '➕ Add New Content'}
                </h2>
                <button onClick={() => setShowModal(false)}
                  style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid-2" style={{ gap: '16px' }}>
                  {[
                    { label: 'Title *', key: 'title', type: 'text', required: true },
                    { label: 'Director', key: 'director', type: 'text' },
                    { label: 'Language', key: 'language', type: 'text' },
                    { label: 'Release Year', key: 'releaseYear', type: 'number' },
                    { label: 'Duration (mins)', key: 'duration', type: 'number' },
                    { label: 'Rating (1-10)', key: 'rating', type: 'number', step: 0.1, min: 0, max: 10 },
                    { label: 'Age Rating', key: 'ageRating', type: 'text' },
                    { label: 'Cast', key: 'cast', type: 'text' },
                  ].map(({ label, key, ...rest }) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'Inter' }}>{label}</label>
                      <input
                        {...rest}
                        value={form[key]}
                        onChange={e => setForm(p => ({ ...p, [key]: rest.type === 'number' ? parseFloat(e.target.value) || e.target.value : e.target.value }))}
                        className="liquid-input"
                        style={{
                          padding: '10px 14px',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                      />
                    </div>
                  ))}
                </div>

                {/* Type + Premium */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '6px' }}>Type</label>
                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem' }}>
                      <option value="MOVIE">MOVIE</option>
                      <option value="SERIES">SERIES</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '22px' }}>
                    <input type="checkbox" id="isPremium" checked={form.isPremium}
                      onChange={e => setForm(p => ({ ...p, isPremium: e.target.checked }))}
                      style={{ width: '18px', height: '18px', accentColor: '#f5a623', cursor: 'pointer' }} />
                    <label htmlFor="isPremium" style={{ color: '#f5a623', fontFamily: 'Outfit', fontWeight: 600, cursor: 'pointer' }}>👑 Premium Content</label>
                  </div>
                </div>

                {/* URL fields */}
                {[
                  { label: 'Poster URL', key: 'posterUrl' },
                  { label: 'Backdrop URL', key: 'backdropUrl' },
                  { label: 'Trailer URL (YouTube embed)', key: 'trailerUrl' },
                  { label: 'Video URL (MP4/HLS)', key: 'videoUrl' },
                ].map(({ label, key }) => (
                  <div key={key} style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '6px' }}>{label}</label>
                    <input type="url" value={form[key]} placeholder="https://"
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="liquid-input"
                      style={{ padding: '10px 14px' }}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                    />
                  </div>
                ))}

                {/* Description */}
                <div style={{ marginTop: '12px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '6px' }}>Description</label>
                  <textarea value={form.description} rows={3}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    className="liquid-input"
                    style={{ padding: '10px 14px', resize: 'vertical', minHeight: '80px' }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(229,9,20,0.5)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>

                {/* Genres */}
                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '8px' }}>Genres</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {genres.map(g => (
                      <button type="button" key={g.id} onClick={() => toggleGenre(g.id)}
                        style={{
                          padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                          background: form.genreIds.includes(g.id) ? '#e50914' : 'rgba(255,255,255,0.08)',
                          color: form.genreIds.includes(g.id) ? '#fff' : '#aaa',
                          fontSize: '0.8rem', fontFamily: 'Inter', transition: 'all 0.2s'
                        }}>{g.name}</button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="button" onClick={() => setShowModal(false)}
                    className="liquid-btn-secondary"
                    style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="liquid-btn-primary"
                    style={{ flex: 2, padding: '12px', justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? 'Saving...' : editingContent ? '✅ Update Content' : '🎬 Create Content'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="liquid-glass-card"
              style={{ padding: '32px', textAlign: 'center', maxWidth: '360px', borderRadius: '24px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🗑️</div>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '8px' }}>Delete Content?</h3>
              <p style={{ color: '#a0a0c0', marginBottom: '24px', fontFamily: 'Inter', fontSize: '0.9rem' }}>This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setDeleteConfirm(null)}
                  className="liquid-btn-secondary"
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="liquid-btn-primary"
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
