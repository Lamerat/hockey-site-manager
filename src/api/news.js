import { API } from '../config/constants.js'
import headers from './headers.js'

export const listNewsRequest = async (body) => {
  return fetch(`${API}/news/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}

export const createNewsRequest = async (body) => {
  return fetch(`${API}/news/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}
