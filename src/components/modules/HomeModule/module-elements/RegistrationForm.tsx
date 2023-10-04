import { useForm } from 'react-hook-form'
import { CustomTextInput } from '@elements'
import { RegistrationRequestInterface, GeneralAuthProps } from '../interface'
import { useAuthContext } from '@contexts'
import { zodResolver } from '@hookform/resolvers/zod'
import { registrationSchema } from '@schemas'
import { getErrorMessage, getToast } from '@utils'
import { AuthResponseInterface } from 'src/components/contexts/AuthContext/interface'
import { CustomButton } from '@elements'
import { useState } from 'react'

export const RegistrationForm: React.FC<GeneralAuthProps> = ({
  setStatusType,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationRequestInterface>({
    resolver: zodResolver(registrationSchema),
  })
  const { httpFetch, setAuthenticatedUser } = useAuthContext()
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const handleRegisterButton = async (body: RegistrationRequestInterface) => {
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
        url: '/auth/registration',
        body: body,
        isAuthorized: false,
      })

      localStorage.setItem('AT', accessToken)
      setAuthenticatedUser(user)
      setStatusType('AUTHENTICATED')
    } catch (error) {
      const { statusCode } = getErrorMessage(error)

      if (statusCode === 409) {
        getToast({message: 'User already exists'})
      } else if (statusCode === 400) {
        getToast({message: 'Invalid email address'})
      } else {
        getToast({})
      }
    } finally {
      setIsLoading(false)
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
            !watch('confirmationPassword') ||
            isLoading
          }
          className="bg-lime-600 hover:bg-lime-500 rounded-lg w-full text-white font-semibold h-9"
        >
          {!watch('name') || !watch('name') || !watch('password') || !watch('confirmationPassword') || !isLoading? 'Register' : 'Loading'}
        </CustomButton>
      </div>
    </form>
  )
}
