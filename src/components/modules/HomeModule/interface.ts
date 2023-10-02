import { Dispatch, SetStateAction } from 'react'

export type StatusType = 'AUTHENTICATED' | 'LOGIN' | 'REGISTER'

export interface GeneralAuthProps {
  setStatusType: Dispatch<SetStateAction<StatusType | undefined>>
}

export interface AuthenticationProps extends GeneralAuthProps {
  statusType: StatusType
}

export interface AuthRequestInterface {
  email: string
  password: string
}

export interface RegistrationRequestInterface extends AuthRequestInterface {
  name: string
  confirmationPassword: string
}

export interface CreateTodoRequestInterface {
  title: string
  description?: string
}

export interface TodoInterface {
  id: string
  title: string
  description: string
  isFinished: boolean
  updatedAt: string
}

export interface TodolistProps {
  todos: TodoInterface[]
}

export interface TodoProps {
  todo: TodoInterface
}

export interface TodoCardProps extends TodoProps, TodolistProps {
  setTodos: Dispatch<SetStateAction<TodoInterface[]>>
}

export interface CreateTodoProps extends TodoCardProps {
  handleIsModalOpen: () => void
}

export interface FormattedDatetimeInterface {
  date: string
  formatPattern?: string
}
