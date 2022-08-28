import { API } from '../config/constants.js'
import headers from './headers.js'

export const listPlayerRequest = async (body) => {
  return fetch(`${API}/player/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const createPlayerRequest = async (body) => {
  return fetch(`${API}/player/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const singlePlayerRequest = async (_id) => {
  return fetch(`${API}/player/${_id}`, {
    method: 'GET',
    headers: headers()
  })
}


export const editPlayerRequest = async (_id, body) => {
  return fetch(`${API}/player/${_id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body)
  })
}


export const deletePlayerRequest = async (_id) => {
  return fetch(`${API}/player/${_id}`, {
    method: 'DELETE',
    headers: headers()
  })
}
