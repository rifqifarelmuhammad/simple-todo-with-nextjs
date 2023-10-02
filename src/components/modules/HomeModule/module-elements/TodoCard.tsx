import { getFormattedDatetime } from '../constant'
import { TodoCardProps, TodoInterface } from '../interface'
import { useAuthContext } from '@contexts'
import { useState } from 'react'
import { getErrorMessage, removeAccessToken } from '@utils'
import { useToast } from 'compfest-silicon'
import { useRouter } from 'next/router'
import { CustomButton } from '@elements'

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  todos,
  setTodos,
}) => {
  const router = useRouter()
  const { httpFetch } = useAuthContext()
  const formattedDateTime = getFormattedDatetime({ date: todo.updatedAt })
  const [state, setState] = useState<boolean>(false)

  const handleUpdateTodo = async () => {
    try {
      const {
        responseCode: _responseCode,
        responseStatus: _responseStatus,
        responseMessage: _responseMessage,
        ...data
      } = await httpFetch<TodoInterface>({
        method: 'patch',
        url: '/todo',
        body: { todoId: todo.id },
      })

      const { isFinished, updatedAt } = data
      todo.isFinished = isFinished
      todo.updatedAt = updatedAt
      setState(!state)
      useToast.success('Todo has been updated')
    } catch (error) {
      const { statusCode, message } = getErrorMessage(error)

      if (statusCode === 400) {
        useToast.error('Todo not found!')
      } else if (statusCode === 401) {
        if (message === 'Invalid Todo') {
          useToast.error('Todo is not yours!')
        } else {
          removeAccessToken(router)
        }
      } else {
        useToast.error('Oops, something wrong! Please wait a moment')
      }
    }
  }

  const handleDeleteTodo = async () => {
    try {
      const {
        responseCode: _responseCode,
        responseStatus: _responseStatus,
        responseMessage: _responseMessage,
      } = await httpFetch({
        method: 'delete',
        url: `/todo/${todo.id}`,
      })

      const updatedTodos = todos.filter((data) => data.id !== todo.id)
      setTodos(updatedTodos)
      useToast.success('Todo has been deleted')
    } catch (error) {
      const { statusCode, message } = getErrorMessage(error)

      if (statusCode === 401) {
        if (message === 'Invalid Todo') {
          useToast.error('Todo is not yours!')
        } else {
          removeAccessToken(router)
        }
      } else {
        useToast.error('Oops, something wrong! Please wait a moment')
      }
    }
  }

  return (
    <div
      key={todo.id}
      className={`w-80 ${
        todo.isFinished ? 'bg-green-500' : 'bg-red-300'
      } rounded-xl relative`}
    >
      <div className="px-4 py-3 flex flex-col gap-2">
        <p className="text-sm font-normal">{formattedDateTime}</p>
        <p className="font-bold text-xl">{todo.title}</p>
        {todo.description && (
          <p className="font-sans font-medium">{todo.description}</p>
        )}

        <div className="pb-6">
          <div className="absolute bottom-3 right-3 flex flex-row gap-3">
            <CustomButton
              onClick={handleUpdateTodo}
              className="bg-lime-600 px-3 py-2 rounded-md text-white"
            >
              Update
            </CustomButton>
            <CustomButton
              onClick={handleDeleteTodo}
              className="bg-red-700 px-3 py-2 rounded-md text-white"
            >
              Delete
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}
