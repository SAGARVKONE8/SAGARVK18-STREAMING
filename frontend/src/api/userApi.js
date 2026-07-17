import API from './axios'

export const getMe          = ()                    => API.get('/users/me')
export const getProfiles    = (userId)              => API.get(`/users/${userId}/profiles`)
export const createProfile  = (userId, data)        => API.post(`/users/${userId}/profiles`, data)
export const updateProfile  = (profileId, data)     => API.put(`/users/profiles/${profileId}`, data)
export const deleteProfile  = (profileId)           => API.delete(`/users/profiles/${profileId}`)
export const subscribe      = (userId, data)        => API.post(`/users/${userId}/subscribe`, data)
export const getPayments    = (userId)              => API.get(`/users/${userId}/payments`)
export const changePassword = (userId, data)        => API.put(`/users/${userId}/change-password`, data)
