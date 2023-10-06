import { useEffect, useState } from 'react'
import { Authentication } from './sections/Authentication'
import { StatusType } from './interface'
import { getAccessToken } from '@utils'
import { useRouter } from 'next/router'
import { Home } from './sections/Home'
import { useAuthContext } from '@contexts'

export const HomeModule: React.FC = () => {
  const { user } = useAuthContext()
  const router = useRouter()
  const [statusType, setStatusType] = useState<StatusType>()

  useEffect(() => {
    const setStatus = async () => {
      const token = await getAccessToken(router)

      if (token) {
        setStatusType('AUTHENTICATED')
      } else {
        setStatusType('LOGIN')
      }
    }

    setStatus()
  }, [user])

  if (!statusType) return <h1>Loading</h1>

  if (statusType === 'LOGIN')
    return <Authentication statusType="LOGIN" setStatusType={setStatusType} />

  if (statusType === 'REGISTER')
    return (
      <Authentication statusType="REGISTER" setStatusType={setStatusType} />
    )
  else return <Home />
}
