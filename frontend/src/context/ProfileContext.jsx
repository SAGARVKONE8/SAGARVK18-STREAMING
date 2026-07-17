import React, { createContext, useContext, useState, useEffect } from 'react'
import { getProfiles } from '../api/userApi'

const ProfileContext = createContext(null)

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([])
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [loadingProfiles, setLoadingProfiles] = useState(false)

  // Restore selected profile from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('selectedProfile')
    if (stored) {
      try {
        setSelectedProfile(JSON.parse(stored))
      } catch {
        localStorage.removeItem('selectedProfile')
      }
    }
  }, [])

  const fetchProfiles = async (userId) => {
    if (!userId) return
    setLoadingProfiles(true)
    try {
      const res = await getProfiles(userId)
      setProfiles(Array.isArray(res.data.data) ? res.data.data : [])
    } catch (err) {
      console.error('Failed to fetch profiles:', err)
      setProfiles([])
    } finally {
      setLoadingProfiles(false)
    }
  }

  const selectProfile = (profile) => {
    setSelectedProfile(profile)
    localStorage.setItem('selectedProfile', JSON.stringify(profile))
  }

  const clearProfile = () => {
    setSelectedProfile(null)
    localStorage.removeItem('selectedProfile')
  }

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        setProfiles,
        selectedProfile,
        loadingProfiles,
        fetchProfiles,
        selectProfile,
        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider')
  return ctx
}

export default ProfileContext
