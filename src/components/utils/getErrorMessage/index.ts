import { ErrorMessageInterface } from './interface'

export const getErrorMessage = (error: any) => {
  return error.response.data as ErrorMessageInterface
}
