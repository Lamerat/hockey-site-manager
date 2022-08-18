import { API } from '../config/constants.js'
import headers from './headers.js'

export const createNewsRequest = async (body) => {
  return fetch(`${API}/news/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}
