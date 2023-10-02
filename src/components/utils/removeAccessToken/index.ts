import { useToast } from 'compfest-silicon'
import { NextRouter } from 'next/router'

export const removeAccessToken = (router: NextRouter) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('AT')
  }

  useToast.error('Oops, something wrong! Please wait a moment')
  router.push('/')
}
