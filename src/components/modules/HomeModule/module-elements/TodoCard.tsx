import { getFormattedDatetime } from '../constant'
import { TodoCardProps, TodoInterface } from '../interface'
import { useAuthContext } from '@contexts'
import { getErrorMessage, getToast, removeAccessToken } from '@utils'
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

      const updatedTodos = filterTodos()
      updatedTodos.unshift(todo)
      setTodos(updatedTodos)
      getToast({ type: 'success', message: 'Todo has been updated' })
    } catch (error) {
      const { statusCode, message } = getErrorMessage(error)

      if (statusCode === 400) {
        getToast({ message: 'Todo not found!' })
      } else {
        handleErrorUpdateDeleteTodo(statusCode, message)
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

      setTodos(filterTodos())
      getToast({ type: 'success', message: 'Todo has been deleted' })
    } catch (error) {
      const { statusCode, message } = getErrorMessage(error)

      handleErrorUpdateDeleteTodo(statusCode, message)
    }
  }

  const handleErrorUpdateDeleteTodo = (statusCode: number, message: string) => {
    if (statusCode === 401) {
      if (message === 'Invalid Todo') {
        getToast({ message: 'Todo is not yours!' })
      } else {
        removeAccessToken(router)
      }
    } else {
      getToast({})
    }
  }

  const filterTodos = () => {
    return todos.filter((data) => data.id !== todo.id)
  }

  return (
    <div
      key={todo.id}
      className={`w-full md:w-72 xl:w-80 ${
        todo.isFinished ? 'bg-green-500' : 'bg-red-300'
      } rounded-xl relative h-full`}
    >
      <div className="px-4 py-3 flex flex-col gap-2">
        <p className="text-xs md:text-sm font-normal">{formattedDateTime}</p>
        <p className="font-bold text-lg md:text-xl">{todo.title}</p>
        {todo.description && (
          <p className="font-sans font-medium text-sm md:text-base">{todo.description}</p>
        )}

        <div className="pb-8 md:pb-6">
          <div className="absolute bottom-3 right-3 flex flex-row gap-3">
            <CustomButton
              onClick={handleUpdateTodo}
              className="bg-lime-600 px-2 md:px-3 py-1 md:py-2 rounded-md text-white"
            >
              <p className='text-sm md:text-base'>Update</p>
            </CustomButton>
            <CustomButton
              onClick={handleDeleteTodo}
              className="bg-red-700 px-2 md:px-3 py-1 md:py-2 rounded-md text-white"
            >
              <p className='text-sm md:text-base'>Delete</p>
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}
