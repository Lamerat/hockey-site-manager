import { API } from '../config/constants.js'
import headers from './headers.js'

export const listBanners = async (body) => {
  return fetch(`${API}/banner/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const createBannerRequest = async (body) => {
  return fetch(`${API}/banner/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const editBannerRequest = async (id, body) => {
  return fetch(`${API}/banner/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const deleteBannerRequest = async (id) => {
  return fetch(`${API}/banner/${id}`, {
    method: 'DELETE',
    headers: headers()    
  })
}