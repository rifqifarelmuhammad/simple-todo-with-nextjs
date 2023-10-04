import axios from 'axios'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  AuthContextInterface,
  AuthContextProviderProps,
  AuthenticatedUserInterface,
  FinalizeUser,
  HttpFetchInterface,
  HttpFetchResponseInterface,
} from './interface'
import { getAccessToken, getErrorMessage, getToast, removeAccessToken } from '@utils'
import { useRouter } from 'next/router'

export const AuthContext = createContext({} as AuthContextInterface)

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const router = useRouter()
  const [user, setUser] = useState<FinalizeUser>()

  async function httpFetch<T>({
    method,
    url,
    body = {},
    isAuthorized = true,
    contentType = 'application/x-www-form-urlencoded',
  }: HttpFetchInterface): Promise<HttpFetchResponseInterface & T> {
    const headers = {
      authorization: '',
      contentType,
    }

    if (isAuthorized) {
      headers['authorization'] = (await getAccessToken(router)) as string
    }

    const { data } = await axios({
      method,
      url: process.env.NEXT_PUBLIC_APP_API_URL + url,
      headers,
      data: method !== 'get' ? body : undefined,
    })

    return data
  }

  function setAuthenticatedUser(user: FinalizeUser) {
    setUser(user)
  }

  useEffect(() => {
    const validateAuthenticatedUser = async () => {
      const accessToken = await getAccessToken(router)

      if (accessToken && !user) {
        try {
          const {
            responseCode: _responseCode,
            responseStatus: _responseStatus,
            responseMessage: _responseMessage,
            user,
          } = await httpFetch<AuthenticatedUserInterface>({
            method: 'get',
            url: '/auth/user',
          })

          setAuthenticatedUser(user)
        } catch (error) {
          const { statusCode } = getErrorMessage(error)

          if (statusCode === 401) {
            removeAccessToken(router)
          } else {
            getToast({})
          }
        }
      }
    }

    validateAuthenticatedUser()
  }, [user])

  const ctxValue = useMemo(() => {
    return {
      httpFetch,
      setAuthenticatedUser,
      user,
    }
  }, [user])

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  )
}
