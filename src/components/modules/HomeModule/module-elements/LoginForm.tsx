import { useForm } from 'react-hook-form'
import { CustomButton, CustomTextInput } from '@elements'
import { GeneralAuthProps, AuthRequestInterface } from '../interface'
import { useAuthContext } from '@contexts'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@schemas'
import { getErrorMessage } from '@utils'
import { useToast } from 'compfest-silicon'
import { AuthResponseInterface } from 'src/components/contexts/AuthContext/interface'

export const LoginForm: React.FC<GeneralAuthProps> = ({ setStatusType }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AuthRequestInterface>({ resolver: zodResolver(loginSchema) })
  const { httpFetch, setAuthenticatedUser } = useAuthContext()

  const handleLoginButton = async (body: AuthRequestInterface) => {
    try {
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
      reset()
    } catch (error) {
      const { statusCode } = getErrorMessage(error)

      if (statusCode === 401) {
        useToast.error('Invalid Email or Password')
      } else {
        useToast.error('Oops, something wrong! Please wait a moment')
      }
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
          isDisabled={!watch('email') || !watch('password')}
          className="rounded-lg w-full text-white font-semibold h-9 bg-lime-600 hover:bg-lime-500"
        >
          Login
        </CustomButton>
      </div>
    </form>
  )
}
