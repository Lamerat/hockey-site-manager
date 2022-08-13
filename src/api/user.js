import { API } from '../config/constants.js'
// import headers from './headers.js'

export const login = async (body) => {
  return fetch(`${API}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
