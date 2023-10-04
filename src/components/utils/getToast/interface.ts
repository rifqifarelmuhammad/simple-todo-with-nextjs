export type ToastType = 'error' | 'success'

export interface ToastInterface {
  type?: ToastType
  message?: string
}
