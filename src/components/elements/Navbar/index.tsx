import { useAuthContext } from '@contexts'
import { CustomButton } from '../CustomButton'
import { getImage } from '@utils'
import Image from 'next/image'
import { useRouter } from 'next/router'

export const Navbar: React.FC = () => {
  const { user } = useAuthContext()
  const router = useRouter()

  const handleEditProfile = () => {
    router.push('/edit-profile')
  }

  if (user)
    return (
      <div className="z-50 sticky inset-0 w-full bg-sky-700">
        <div className="py-3 flex flex-row gap-4 items-center">
          <div className="w-3/4 pl-10 flex flex-row gap-3 items-center">
            <div className="rounded-full bg-white w-16 h-16 relative aspect-square">
              <Image
                src={getImage(
                  user?.avatar !== ''
                    ? user.avatar
                    : (process.env.NEXT_PUBLIC_DEFAULT_AVATAR as string)
                )}
                alt="user's avatar"
                fill
                sizes="none"
                quality={100}
                className="rounded-full"
              />
            </div>
            <p className="font-semibold text-xl text-white">{user.name}</p>
          </div>

          <div className="absolute right-6">
            <CustomButton
              onClick={handleEditProfile}
              clasName="bg-blue-200 px-3 py-2"
            >
              <p className="text-[#202F45] font-bold">Edit Profile</p>
            </CustomButton>
          </div>
        </div>
      </div>
    )
  else return <></>
}
