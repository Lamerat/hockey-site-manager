import { API } from '../config/constants.js'
import headers from './headers.js'

export const listArenas = async (body) => {
  return fetch(`${API}/arena/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}

export const createArena = async (body) => {
  return fetch(`${API}/arena/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const deleteArena = async (_id) => {
  return fetch(`${API}/arena/${_id}`, {
    method: 'DELETE',
    headers: headers()
  })
}


export const editArena = async (_id, body) => {
  return fetch(`${API}/arena/${_id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const singleArena = async (_id) => {
  return fetch(`${API}/arena/${_id}`, {
    method: 'GET',
    headers: headers(),
  })
}
