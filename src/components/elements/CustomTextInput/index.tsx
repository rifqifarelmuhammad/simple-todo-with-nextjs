import { CustomTextInputProps } from './interface'
import { Input, Button } from '@chakra-ui/react'
import { useState, forwardRef } from 'react'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { useWindowSize } from 'usehooks-ts'

export const CustomTextInput = forwardRef<
  HTMLInputElement,
  CustomTextInputProps
>(
  (
    { label, placeholder, type = 'text', error, readonly = false, ...props },
    ref
  ) => {
    const { width } = useWindowSize()
    const [isVisible, setIsVisible] = useState<boolean>(false)

    const handleButtonIsVisible = () => {
      setIsVisible(!isVisible)
    }

    return (
      <div className="flex flex-col gap-1">
        {label && <p className='text-base md:text-xl'>{label}</p>}

        <div className={type === 'password' ? 'relative' : ''}>
          <Input
            readOnly={readonly}
            ref={ref}
            type={type === 'text' ? 'text' : isVisible ? 'text' : 'password'}
            placeholder={placeholder}
            _placeholder={{ opacity:1, color: 'gray.600' }}
            className="w-full h-8 rounded-lg px-1 md:px-2 text-black font-sans bg-slate-100 text-base z-0"
            size={width < 768? 'sm' : 'md'}
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
                  <AiFillEyeInvisible className="text-black hover:text-gray-600" />
                ) : (
                  <AiFillEye className="text-black hover:text-gray-600" />
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
