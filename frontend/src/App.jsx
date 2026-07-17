import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'

import LandingPage       from './pages/LandingPage/LandingPage'
import LoginPage         from './pages/LoginPage/LoginPage'
import RegisterPage      from './pages/RegisterPage/RegisterPage'
import ProfileSelectPage from './pages/ProfileSelectPage/ProfileSelectPage'
import HomePage          from './pages/HomePage/HomePage'
import SearchPage        from './pages/SearchPage/SearchPage'
import ContentDetailPage from './pages/ContentDetailPage/ContentDetailPage'
import PlayerPage        from './pages/PlayerPage/PlayerPage'
import WatchlistPage     from './pages/WatchlistPage/WatchlistPage'
import AccountPage       from './pages/AccountPage/AccountPage'
import AdminPage         from './pages/AdminPage/AdminPage'
import LoadingSpinner    from './components/UI/LoadingSpinner'

/* ─── Route Guards ─── */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/home" replace />
  return children
}

/* ─── Routes ─── */
const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/"         element={<LandingPage />} />
    <Route path="/login"    element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Protected — needs ProfileProvider */}
    <Route path="/select-profile" element={
      <ProtectedRoute>
        <ProfileProvider><ProfileSelectPage /></ProfileProvider>
      </ProtectedRoute>
    } />
    <Route path="/home" element={
      <ProtectedRoute>
        <ProfileProvider><HomePage /></ProfileProvider>
      </ProtectedRoute>
    } />
    <Route path="/search" element={
      <ProtectedRoute>
        <ProfileProvider><SearchPage /></ProfileProvider>
      </ProtectedRoute>
    } />
    <Route path="/content/:id" element={
      <ProtectedRoute>
        <ProfileProvider><ContentDetailPage /></ProfileProvider>
      </ProtectedRoute>
    } />
    <Route path="/watch/:id" element={
      <ProtectedRoute>
        <ProfileProvider><PlayerPage /></ProfileProvider>
      </ProtectedRoute>
    } />
    <Route path="/watchlist" element={
      <ProtectedRoute>
        <ProfileProvider><WatchlistPage /></ProfileProvider>
      </ProtectedRoute>
    } />
    <Route path="/account" element={
      <ProtectedRoute>
        <ProfileProvider><AccountPage /></ProfileProvider>
      </ProtectedRoute>
    } />

    {/* Admin-only */}
    <Route path="/admin" element={
      <AdminRoute>
        <ProfileProvider><AdminPage /></ProfileProvider>
      </AdminRoute>
    } />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

/* ─── Root App ─── */
const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#e50914', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#e50914', secondary: '#fff' },
          },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
)

export default App
