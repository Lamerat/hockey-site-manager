import { API } from '../config/constants.js'
import headers from './headers.js'

export const listEvents = async (body) => {
  return fetch(`${API}/event/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const createEventRequest = async (body) => {
  return fetch(`${API}/event/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const singleEventRequest = async (_id) => {
  return fetch(`${API}/event/${_id}`, {
    method: 'GET',
    headers: headers()
  })
}


export const editEventRequest = async (_id, body) => {
  return fetch(`${API}/event/${_id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const deleteEventRequest = async (_id) => {
  return fetch(`${API}/event/${_id}`, {
    method: 'DELETE',
    headers: headers()
  })
}