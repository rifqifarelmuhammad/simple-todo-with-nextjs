import { useAuthContext } from '@contexts'
import { getImage } from '@utils'
import Image from 'next/image'
import { NavItem } from './NavItem'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { CustomButton } from '../CustomButton'
import { useState } from 'react'

export const Navbar: React.FC = () => {
  const { user } = useAuthContext()
  const [isCollapsed, setIsCollapsed] = useState(true)

  const handleNavPanel = () => {
    setIsCollapsed(!isCollapsed)
  }

  if (user)
    return (
      <div className="z-50 sticky inset-0 w-full bg-sky-700 flex flex-col">
        <div className="py-2 lg:py-3 flex flex-row gap-4 items-center">
          <div className="w-3/4 pl-4 md:pl-6 flex flex-row gap-2 md:gap-3 items-center">
            <div className="rounded-full bg-white w-14 lg:w-16 h-14 lg:h-16 relative aspect-square">
              <Image
                src={getImage(user?.avatar)}
                alt="user's avatar"
                fill
                sizes="none"
                quality={100}
                className="rounded-full"
              />
            </div>
            <p className="font-semibold text-lg lg:text-xl text-white">
              {user.name}
            </p>
          </div>

          <div className="absolute right-4 md:right-6">
            <div className="hidden md:flex">
              <NavItem />
            </div>

            <CustomButton onClick={handleNavPanel} clasName="w-fit">
              <Bars3Icon className="w-8 text-white" />
            </CustomButton>
          </div>
        </div>

        {!isCollapsed && (
          <div className="py-3 px-4">
            <NavItem />
          </div>
        )}
      </div>
    )
  else return <></>
}
