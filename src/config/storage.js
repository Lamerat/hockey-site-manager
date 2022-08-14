export const storeCredentials = (data) => {
  const { token, user } = data
  localStorage.setItem('token', JSON.stringify(token))
  localStorage.setItem('user', JSON.stringify(user))
}


export const getCredentials = () => localStorage.getItem('token')

export const cleanCredentials = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}