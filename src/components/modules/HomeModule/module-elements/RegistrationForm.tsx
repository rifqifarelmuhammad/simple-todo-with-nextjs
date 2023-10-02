import { useForm } from 'react-hook-form'
import { CustomTextInput } from '@elements'
import { RegistrationRequestInterface, GeneralAuthProps } from '../interface'
import { useAuthContext } from '@contexts'
import { zodResolver } from '@hookform/resolvers/zod'
import { registrationSchema } from '@schemas'
import { getErrorMessage } from '@utils'
import { useToast } from 'compfest-silicon'
import { AuthResponseInterface } from 'src/components/contexts/AuthContext/interface'
import { CustomButton } from '@elements'

export const RegistrationForm: React.FC<GeneralAuthProps> = ({
  setStatusType,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegistrationRequestInterface>({
    resolver: zodResolver(registrationSchema),
  })
  const { httpFetch, setAuthenticatedUser } = useAuthContext()

  const handleRegisterButton = async (body: RegistrationRequestInterface) => {
    try {
      const {
        responseCode: _responseCode,
        responseStatus: _responseStatus,
        responseMessage: _responseMessage,
        accessToken,
        user,
      } = await httpFetch<AuthResponseInterface>({
        method: 'post',
        url: '/auth/registration',
        body: body,
        isAuthorized: false,
      })

      localStorage.setItem('AT', accessToken)
      setAuthenticatedUser(user)
      setStatusType('AUTHENTICATED')
      reset()
    } catch (error) {
      const { statusCode } = getErrorMessage(error)

      if (statusCode === 409) {
        useToast.error('User already exists')
      } else if (statusCode === 400) {
        useToast.error('Invalid email address')
      } else {
        useToast.error('Oops, something wrong! Please wait a moment')
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleRegisterButton)}
      className="text-xl flex flex-col gap-3"
    >
      <CustomTextInput
        label="Name"
        placeholder="Enter your name"
        error={errors.name?.message}
        {...register('name', { required: true })}
      />

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

      <CustomTextInput
        label="Confirmation Password"
        placeholder="Re-enter your password"
        type="password"
        error={errors.confirmationPassword?.message}
        {...register('confirmationPassword', { required: true })}
      />

      <div className="flex justify-center pt-3">
        <CustomButton
          type="submit"
          isDisabled={
            !watch('name') ||
            !watch('email') ||
            !watch('password') ||
            !watch('confirmationPassword')
          }
          className="bg-lime-600 hover:bg-lime-500 rounded-lg w-full text-white font-semibold h-9"
        >
          Register
        </CustomButton>
      </div>
    </form>
  )
}
