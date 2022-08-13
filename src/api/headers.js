const headers = () => {
  const token = JSON.parse(localStorage.getItem('token'))
  if (token) {
    return { 'Content-Type': 'application/json', 'authorization': token }
  } else {
    return { 'Content-Type': 'application/json' }
  }
}

export default headers