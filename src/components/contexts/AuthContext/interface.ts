import { ReactNode } from 'react'

export interface AuthContextProviderProps {
  children: ReactNode
}

export interface AuthContextInterface {
  httpFetch: <T>(
    props: HttpFetchInterface
  ) => Promise<HttpFetchResponseInterface & T>
  setAuthenticatedUser(user?: FinalizeUser): void
  user: FinalizeUser | undefined
}

export interface HttpFetchInterface {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  url: string
  isAuthorized?: boolean
  body?: any
  contentType?: string
}

export interface HttpFetchResponseInterface {
  responseCode: number
  responseMessage: string
  responseStatus: 'SUCCESS' | 'FAILED'
}

export interface AuthenticatedUserInterface {
  user: FinalizeUser
}

export interface AuthResponseInterface extends AuthenticatedUserInterface {
  accessToken: string
}

export interface FinalizeUser {
  name: string
  avatar: string
}
