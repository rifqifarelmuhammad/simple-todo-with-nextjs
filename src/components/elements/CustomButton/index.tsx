import { Button } from '@chakra-ui/react'
import { CustomButtonProps } from './interface'

export const CustomButton: React.FC<
  CustomButtonProps & React.ComponentPropsWithoutRef<'button'>
> = ({
  children,
  isDisabled = false,
  clasName = 'px-3 py-2 rounded-md',
  type = 'button',
  ...props
}) => (
  <Button
    colorScheme=""
    size=""
    isDisabled={isDisabled}
    className={clasName}
    type={type}
    {...props}
  >
    {children}
  </Button>
)
