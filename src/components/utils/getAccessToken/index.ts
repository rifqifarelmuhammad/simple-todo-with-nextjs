import { NextRouter } from 'next/router'
import { removeAccessToken } from '../removeAccessToken'
import { ParseJwtInterface } from './interface'

export const getAccessToken = async (router: NextRouter) => {
  try {
    const token = localStorage.getItem('AT')

    if (token) {
      if (validateJWTExp(token)) {
        return `Bearer ${token}`
      } else {
        throw new Error('Access Token is expired')
      }
    } else {
      return undefined
    }
  } catch (error: any) {
    if (error.message === 'Invalid JWT Token') {
      removeAccessToken(router)
    }
  }
}

const validateJWTExp = (token: string) => {
  const rawToken = token.includes('Bearer') ? token.split(' ')[1] : token

  const { exp, iat } = parseJwt(rawToken)

  const now = Math.round(new Date().getTime() / 1000)

  const timeElapsed = now - iat
  const timeRemaining = exp - iat

  return timeElapsed < timeRemaining
}

const parseJwt = (token: string): ParseJwtInterface => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(window.atob(base64))
}
