import { API } from '../config/constants.js'
import headers from './headers.js'

export const listPhotosRequest = async (body) => {
  return fetch(`${API}/photo/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}
