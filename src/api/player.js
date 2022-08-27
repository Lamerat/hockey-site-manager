import { API } from '../config/constants.js'
import headers from './headers.js'

export const listPlayerRequest = async (body) => {
  return fetch(`${API}/player/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}

