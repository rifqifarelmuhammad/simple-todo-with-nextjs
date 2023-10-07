import { useForm } from 'react-hook-form'
import {
  CreateTodoRequestInterface,
  TodoInterface,
  CreateTodoProps,
} from '../interface'
import { CustomButton, CustomTextInput } from '@elements'
import { createTodoSchema } from '@schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthContext } from '@contexts'
import { getErrorMessage, getToast, removeAccessToken } from '@utils'
import { useRouter } from 'next/router'

export const CreateTodoForm: React.FC<CreateTodoProps> = ({
  todos,
  setTodos,
  handleIsModalOpen,
}) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateTodoRequestInterface>({
    resolver: zodResolver(createTodoSchema),
  })
  const { httpFetch } = useAuthContext()

  const handleCreateButton = async (body: CreateTodoRequestInterface) => {
    try {
      const {
        responseCode: _responseCode,
        responseStatus: _responseStatus,
        responseMessage: _responseMessage,
        ...todo
      } = await httpFetch<TodoInterface>({
        method: 'post',
        url: '/todo',
        body: body,
      })

      todos.push(todo)
      setTodos(todos)
      handleIsModalOpen()
    } catch (error) {
      const { statusCode } = getErrorMessage(error)

      if (statusCode === 401) {
        removeAccessToken(router)
      } else {
        getToast({})
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateButton)}
      className="text-xl flex flex-col gap-3 text-[#202F45] text-left"
    >
      <CustomTextInput
        label="Title*"
        placeholder="Todo's title"
        error={errors.title?.message}
        {...register('title', { required: true })}
      />

      <CustomTextInput
        label="Description"
        placeholder="Todo's description"
        error={errors.description?.message}
        {...register('description')}
      />

      <p className="text-sm text-green-600">* indicates required</p>

      <div className="pt-2 w-full">
        <CustomButton
          type="submit"
          isDisabled={!watch('title')}
          clasName="w-full text-white py-2 bg-cyan-600 hover:bg-cyan-500"
        >
          <p className="text-lg md:text-xl">Create</p>
        </CustomButton>
      </div>
    </form>
  )
}
