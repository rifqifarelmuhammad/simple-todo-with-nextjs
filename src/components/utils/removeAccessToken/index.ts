import { NextRouter } from 'next/router'
import { getToast } from '../getToast'

export const removeAccessToken = (router: NextRouter) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('AT')
  }

  getToast({})
  router.push('/')
}
