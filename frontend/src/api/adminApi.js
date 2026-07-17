import API from './axios'

export const adminGetUsers      = ()            => API.get('/admin/users')
export const adminCreateContent = (data)        => API.post('/admin/content', data)
export const adminUpdateContent = (id, data)    => API.put(`/admin/content/${id}`, data)
export const adminDeleteContent = (id)          => API.delete(`/admin/content/${id}`)
export const adminUpdateRole    = (userId, role)=> API.put(`/admin/users/${userId}/role?role=${role}`)
