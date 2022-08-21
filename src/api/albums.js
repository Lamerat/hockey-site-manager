import { API } from '../config/constants.js'
import headers from './headers.js'

export const listAlbums = async (body) => {
  return fetch(`${API}/album/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}

