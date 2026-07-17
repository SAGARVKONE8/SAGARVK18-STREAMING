import API from './axios'

export const getWatchlist        = (profileId)           => API.get(`/watchlist/profile/${profileId}`)
export const addToWatchlist      = (profileId, contentId)=> API.post(`/watchlist/profile/${profileId}/content/${contentId}`)
export const removeFromWatchlist = (profileId, contentId)=> API.delete(`/watchlist/profile/${profileId}/content/${contentId}`)
export const checkWatchlist      = (profileId, contentId)=> API.get(`/watchlist/profile/${profileId}/content/${contentId}/check`)
