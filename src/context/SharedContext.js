import { createContext } from 'react'

const SharedContext = createContext({
  sharedData: null,
  setSharedData: () => {}
})

export default SharedContext
