import { useAuthContext } from '@contexts'
import { useEffect, useState } from 'react'
import { TodoInterface, TodolistProps } from '../interface'
import { TodoCard } from '../module-elements/TodoCard'
import { getErrorMessage, getToast, removeAccessToken } from '@utils'
import { useRouter } from 'next/router'
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/react'
import { CreateTodoForm } from '../module-elements/CreateTodoForm'

export const Home: React.FC = () => {
  const router = useRouter()
  const { httpFetch } = useAuthContext()
  const [data, setData] = useState<TodoInterface[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    try {
      const getAllTodo = async () => {
        const {
          responseCode: _responseCode,
          responseStatus: _responseStatus,
          responseMessage: _responseMessage,
          todos,
        } = await httpFetch<TodolistProps>({
          method: 'get',
          url: '/todo/desc',
        })

        setData(todos)
      }

      getAllTodo()
    } catch (error) {
      const { statusCode } = getErrorMessage(error)

      if (statusCode === 401) {
        removeAccessToken(router)
      } else {
        getToast({})
      }
    }
  }, [])

  const handleIsModalOpen = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <>
      <div className="flex flex-col gap-11 px-4 md:px-12 mx-auto max-w-[1440px] items-center z-10">
        <h1 className="text-center text-6xl font-bold">
          Welcome To Simple Todolist
        </h1>

        <Button
          onClick={handleIsModalOpen}
          className="rounded-md px-4 py-2 bg-blue-200 w-fit font-semibold text-lg"
        >
          Create Todo
        </Button>

        <div className="grid grid-cols-3 gap-4 w-full">
          {data.map((todo) => (
            <TodoCard todos={data} setTodos={setData} todo={todo} />
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleIsModalOpen}>
        <ModalOverlay />

        <ModalContent className="flex flex-col py-6 px-6">
          <ModalCloseButton />

          <ModalHeader>
            <p className="text-[#202F45]">Create Todo</p>
          </ModalHeader>

          <ModalBody>
            <CreateTodoForm
              setTodos={setData}
              todos={data}
              todo={{} as TodoInterface}
              handleIsModalOpen={handleIsModalOpen}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
