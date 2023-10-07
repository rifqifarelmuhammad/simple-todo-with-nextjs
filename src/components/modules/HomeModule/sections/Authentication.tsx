import { AuthenticationProps } from '../interface'
import { LoginForm } from '../module-elements/LoginForm'
import { Button } from '@chakra-ui/react'
import { RegistrationForm } from '../module-elements/RegistrationForm'

export const Authentication: React.FC<AuthenticationProps> = ({
  statusType,
  setStatusType,
}) => {
  const handleChangeStatusButton = () => {
    if (statusType === 'LOGIN') {
      setStatusType('REGISTER')
    }

    if (statusType === 'REGISTER') {
      setStatusType('LOGIN')
    }
  }

  return (
    <>
      <div className="my-auto px-4 md:px-8 mx-auto max-w-[550px] w-full bg-green-400 rounded-2xl">
        <div className="px-2 py-8 flex flex-col gap-4">
          <h1 className="text-xl md:text-3xl font-semibold text-center">
            {statusType === 'LOGIN'
              ? 'Sign in to Simple Todolist'
              : 'Please fill your data!'}
          </h1>

          {statusType === 'LOGIN' ? (
            <LoginForm setStatusType={setStatusType} />
          ) : (
            <RegistrationForm setStatusType={setStatusType} />
          )}

          <Button
            variant="contained"
            className="bg-gray-700 hover:bg-gray-500 rounded-sm w-full py-1 text-white font-semibold h-9"
            onClick={handleChangeStatusButton}
          >
            <p className='text-base md:text-xl'>
              {statusType === 'LOGIN'
                ? `Don't have account?`
                : `Already have an acoount?`}
            </p>
          </Button>
        </div>
      </div>
    </>
  )
}
