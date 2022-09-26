import { API } from '../config/constants.js'
import headers from './headers.js'

export const listBanners = async (body) => {
  return fetch(`${API}/banner/list`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
}


// export const createArticleRequest = async (body) => {
//   return fetch(`${API}/info/create`, {
//     method: 'POST',
//     headers: headers(),
//     body: JSON.stringify(body),
//   })
// }


// export const singleArticleRequest = async (id) => {
//   return fetch(`${API}/info/${id}`, {
//     method: 'GET',
//     headers: headers(),
//   })
// }


// export const editArticleRequest = async (id, body) => {
//   return fetch(`${API}/info/${id}`, {
//     method: 'PUT',
//     headers: headers(),
//     body: JSON.stringify(body),
//   })
// }


// export const deleteArticleRequest = async (id) => {
//   return fetch(`${API}/info/${id}`, {
//     method: 'DELETE',
//     headers: headers()    
//   })
// }