import { API } from '../config/constants.js'
import headers from './headers.js'

export const listEvents = async (body) => {
  return fetch(`${API}/event/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}