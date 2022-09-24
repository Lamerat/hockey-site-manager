import { API } from '../config/constants.js'
import headers from './headers.js'

export const listArticles = async (body) => {
  return fetch(`${API}/info/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}