import { API } from '../config/constants.js'
import headers from './headers.js'

export const listPhotosRequest = async (body) => {
  return fetch(`${API}/photo/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const uploadPhotosRequest = async (body) => {
  return fetch(`${API}/photo/upload`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'authorization': headers().authorization
    },
    body
  })
}


export const changePositionsRequest = async (body) => {
  return fetch(`${API}/photo/positions`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const changeNameRequest = async (body) => {
  return fetch(`${API}/photo/name`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


export const deletePhotoRequest = async (_id) => {
  return fetch(`${API}/photo/${_id}`, {
    method: 'DELETE',
    headers: headers()
  })
}


export const changePhotoAlbumRequest = async (body) => {
  return fetch(`${API}/photo/move`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
}