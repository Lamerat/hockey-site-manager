import { API } from '../config/constants.js'
import headers from './headers.js'

export const listAlbums = async (body) => {
  return fetch(`${API}/album/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const setMainAlbum = async (_id) => {
  return fetch(`${API}/album/main/${_id}`, {
    method: 'PUT',
    headers: headers(),
  })
}


export const createAlbum = async (body) => {
  return fetch(`${API}/album/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const editAlbumRequest = async (_id, body) => {
  return fetch(`${API}/album/${_id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const deleteAlbumRequest = async (_id) => {
  return fetch(`${API}/album/${_id}`, {
    method: 'DELETE',
    headers: headers()    
  })
}
