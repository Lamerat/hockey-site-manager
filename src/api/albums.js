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

