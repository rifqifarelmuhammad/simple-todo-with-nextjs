import { useRouter } from "next/router"
import { CustomButton } from "../CustomButton"
import { useAuthContext } from "@contexts"
import { getToast } from "@utils"

export const NavItem: React.FC = () => {
    const { httpFetch, setAuthenticatedUser } = useAuthContext()
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

    return (
        <div className="flex flex-col md:flex-row gap-3 md:gap-2">
            <CustomButton
              onClick={handleEditProfile}
              clasName="bg-blue-200 px-3 py-2"
            >
              <p className="text-[#202F45] font-bold text-sm lg:text-base">Edit Profile</p>
            </CustomButton>

            <CustomButton
              onClick={handleLogout}
              clasName="bg-red-600 px-3 py-2 text-sm lg:text-base"
            >
              Logout
            </CustomButton>
        </div>
    )
}