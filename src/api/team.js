import { API } from '../config/constants.js'
import headers from './headers.js'

export const listTeams = async (body) => {
  return fetch(`${API}/team/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}

export const createTeam = async (body) => {
  return fetch(`${API}/team/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const deleteTeam = async (_id) => {
  return fetch(`${API}/team/${_id}`, {
    method: 'DELETE',
    headers: headers()
  })
}


export const editTeam = async (_id, body) => {
  return fetch(`${API}/team/${_id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const singleTeam = async (_id) => {
  return fetch(`${API}/team/${_id}`, {
    method: 'GET',
    headers: headers(),
  })
}
