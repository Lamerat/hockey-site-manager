import { API } from '../config/constants.js'
import headers from './headers.js'

export const login = async (body) => {
  return fetch(`${API}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export const myProfileRequest = async () => {
  return fetch(`${API}/user/profile`, {
    method: 'GET',
    headers: headers()
  })
}

export const changeProfileName = async (body) => {
  return fetch(`${API}/user/edit`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body)
  })
}


export const changePassword = async (body) => {
  return fetch(`${API}/user/password`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body)
  })
}


export const createNewUser = async (body) => {
  return fetch(`${API}/user/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body)
  })
}