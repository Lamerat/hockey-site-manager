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

export const deleteNewsRequest = async (_id) => {
  return fetch(`${API}/news/${_id}`, {
    method: 'DELETE',
    headers: headers()
  })
}


export const editNewsRequest = async (_id, body) => {
  return fetch(`${API}/news/${_id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const singleNewsRequest = async (_id) => {
  return fetch(`${API}/news/${_id}`, {
    method: 'GET',
    headers: headers(),
  })
}