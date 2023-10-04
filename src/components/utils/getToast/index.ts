import { useToast } from 'compfest-silicon'
import { ToastInterface } from './interface'

export const getToast = ({
  type = 'error',
  message = 'Oops, something wrong! Please wait a moment',
}: ToastInterface) => {
  if (type === 'error') {
    useToast.error(message)
  } else {
    useToast.success(message)
  }
}
