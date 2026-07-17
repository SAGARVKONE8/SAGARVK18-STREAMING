import API from './axios'

export const getAllContent  = (page = 0, size = 20) => API.get(`/content?page=${page}&size=${size}`)
export const getContent    = (id)                   => API.get(`/content/${id}`)
export const searchContent = (query, page = 0)      => API.get(`/content/search?query=${encodeURIComponent(query)}&page=${page}`)
export const getTrending   = ()                     => API.get('/content/trending')
export const getNewReleases= ()                     => API.get('/content/new-releases')
export const getTopRated   = ()                     => API.get('/content/top-rated')
export const getByType     = (type)                 => API.get(`/content/type/${type}`)
export const getByGenre    = (genre)                => API.get(`/content/genre/${encodeURIComponent(genre)}`)
export const getGenres     = ()                     => API.get('/content/genres')
export const getPlans      = ()                     => API.get('/plans')
export const getRatings    = (contentId)            => API.get(`/ratings/content/${contentId}`)
export const rateContent   = (contentId, data)      => API.post(`/ratings/content/${contentId}`, data)
