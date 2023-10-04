import { useForm } from 'react-hook-form'
import { CustomButton, CustomTextInput } from '@elements'
import { GeneralAuthProps, AuthRequestInterface } from '../interface'
import { useAuthContext } from '@contexts'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@schemas'
import { getErrorMessage, getToast } from '@utils'
import { AuthResponseInterface } from 'src/components/contexts/AuthContext/interface'
import { useState } from 'react'

export const LoginForm: React.FC<GeneralAuthProps> = ({ setStatusType }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthRequestInterface>({ resolver: zodResolver(loginSchema) })
  const { httpFetch, setAuthenticatedUser } = useAuthContext()
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const handleLoginButton = async (body: AuthRequestInterface) => {
    try {
      setIsLoading(true)

      const {
        responseCode: _responseCode,
        responseStatus: _responseStatus,
        responseMessage: _responseMessage,
        accessToken,
        user,
      } = await httpFetch<AuthResponseInterface>({
        method: 'post',
        url: '/auth/login',
        body: body,
        isAuthorized: false,
      })

      localStorage.setItem('AT', accessToken)
      setAuthenticatedUser(user)
      setStatusType('AUTHENTICATED')
    } catch (error) {
      const { statusCode } = getErrorMessage(error)

      if (statusCode === 401) {
        getToast({message: 'Invalid Email or Password'})
      } else {
        getToast({})
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleLoginButton)}
      className="text-xl flex flex-col gap-3"
    >
      <CustomTextInput
        label="Email"
        placeholder="example@domain.com"
        error={errors.email?.message}
        {...register('email', { required: true })}
      />

      <CustomTextInput
        label="Password"
        placeholder="Enter your password"
        type="password"
        error={errors.password?.message}
        {...register('password', { required: true })}
      />

      <div className="flex justify-center pt-3">
        <CustomButton
          type="submit"
          isDisabled={!watch('email') || !watch('password') || isLoading}
          className="rounded-lg w-full text-white font-semibold h-9 bg-lime-600 hover:bg-lime-500"
        >
          {!watch('email') || !watch('password') || !isLoading? 'Login' : 'Loading'}
        </CustomButton>
      </div>
    </form>
  )
}
