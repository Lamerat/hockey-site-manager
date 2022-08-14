import { API } from '../config/constants.js'
import headers from './headers.js'

export const listCities = async (body) => {
  return fetch(`${API}/city/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}

export const createCity = async (body) => {
  return fetch(`${API}/city/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const deleteCity = async (_id) => {
  return fetch(`${API}/city/${_id}`, {
    method: 'DELETE',
    headers: headers()
  })
}


export const editCity = async (_id, body) => {
  return fetch(`${API}/city/${_id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const singleCity = async (_id) => {
  return fetch(`${API}/city/${_id}`, {
    method: 'GET',
    headers: headers(),
  })
}
