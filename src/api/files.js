import { API } from '../config/constants.js'
import headers from './headers.js'

export const uploadFiles = async (body) => {
  return fetch(`${API}/files/upload`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'authorization': headers().authorization
    },
    body
  })
}