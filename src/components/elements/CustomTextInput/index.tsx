import { CustomTextInputProps } from './interface'
import { Input, Button } from '@chakra-ui/react'
import { useState, forwardRef } from 'react'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'

export const CustomTextInput = forwardRef<
  HTMLInputElement,
  CustomTextInputProps
>(
  (
    { label, placeholder, type = 'text', error, readonly = false, ...props },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState<boolean>(false)

    const handleButtonIsVisible = () => {
      setIsVisible(!isVisible)
    }

    return (
      <div className="flex flex-col gap-1">
        {label && <p>{label}</p>}

        <div className={type === 'password' ? 'relative' : ''}>
          <Input
            readOnly={readonly}
            ref={ref}
            type={type === 'text' ? 'text' : isVisible ? 'text' : 'password'}
            placeholder={placeholder}
            className="w-full h-8 rounded-lg px-2 text-[#202F45] font-sans bg-slate-100 text-base z-0"
            {...props}
          />

          {type === 'password' && (
            <div className="absolute top-[5px] right-4 z-10">
              <Button
                onClick={handleButtonIsVisible}
                colorScheme=""
                size=""
                className=""
              >
                {isVisible ? (
                  <AiFillEyeInvisible className="text-[#202F45] hover:text-gray-600" />
                ) : (
                  <AiFillEye className="text-[#202F45] hover:text-gray-600" />
                )}
              </Button>
            </div>
          )}

          {error && <p className="text-base text-red-700">{error}</p>}
        </div>
      </div>
    )
  }
)
