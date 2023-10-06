import { useAuthContext } from '@contexts'
import { CustomButton } from '../CustomButton'
import { getImage, getToast } from '@utils'
import Image from 'next/image'
import { useRouter } from 'next/router'

export const Navbar: React.FC = () => {
  const { user, httpFetch, setAuthenticatedUser } = useAuthContext()
  const router = useRouter()

  const handleEditProfile = () => {
    router.push('/edit-profile')
  }

  const handleLogout = async () => {
    try {
      const {
        responseCode: _responseCode,
        responseStatus: _responseStatus,
        responseMessage: _responseMessage,
      } = await httpFetch({
        method: 'patch',
        url: '/auth/logout',
      })

      localStorage.removeItem('AT')
      setAuthenticatedUser(undefined)
      getToast({ type: 'success', message: 'Logout Successful' })
      router.push('/')
    } catch (error) {
      getToast({})
    }
  }

  if (user)
    return (
      <div className="z-50 sticky inset-0 w-full bg-sky-700">
        <div className="py-3 flex flex-row gap-4 items-center">
          <div className="w-3/4 pl-10 flex flex-row gap-3 items-center">
            <div className="rounded-full bg-white w-16 h-16 relative aspect-square">
              <Image
                src={getImage(user?.avatar)}
                alt="user's avatar"
                fill
                sizes="none"
                quality={100}
                className="rounded-full"
              />
            </div>
            <p className="font-semibold text-xl text-white">{user.name}</p>
          </div>

          <div className="absolute right-6 flex flex-row gap-2">
            <CustomButton
              onClick={handleEditProfile}
              clasName="bg-blue-200 px-3 py-2"
            >
              <p className="text-[#202F45] font-bold">Edit Profile</p>
            </CustomButton>

            <CustomButton
              onClick={handleLogout}
              clasName="bg-red-600 px-3 py-2"
            >
              Logout
            </CustomButton>
          </div>
        </div>
      </div>
    )
  else return <></>
}
