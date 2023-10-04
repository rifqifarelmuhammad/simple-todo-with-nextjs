import { useForm } from 'react-hook-form'
import { useAuthContext } from '@contexts'
import { CustomButton, CustomTextInput } from '@elements'
import { ChangeEvent, useState } from 'react'
import { Tab, TabList, Tabs } from '@chakra-ui/react'
import { EditProfileFormProps, DeleteAvatarRequestInterface } from './interface'
import { IMAGE_FILE_TYPE } from './constant'
import { zodResolver } from '@hookform/resolvers/zod'
import { editProfileSchema } from '@schemas'
import { getErrorMessage, getToast, removeAccessToken } from '@utils'
import { useRouter } from 'next/router'
import { FinalizeUser } from 'src/components/contexts/AuthContext/interface'

export const EditProfileModule: React.FC = () => {
  const router = useRouter()
  const { httpFetch, setAuthenticatedUser, user } = useAuthContext()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormProps>({
    resolver: zodResolver(editProfileSchema),
  })
  const [selectedFile, setSelectedFile] = useState<File>()
  const [invalidFileType, setInvalidFileType] = useState<boolean>(false)
  const [isUpdateAvatar, setIsUpdateAvatar] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setInvalidFileType(false)
      setSelectedFile(undefined)
      return
    }

    const fileName = file?.name
    const splittedFileName = fileName?.split('.')
    const fileType = (splittedFileName ?? [])[
      (splittedFileName?.length ?? 1) - 1
    ]

    if (IMAGE_FILE_TYPE.includes(fileType)) {
      setInvalidFileType(false)
      setSelectedFile(file)
    } else {
      setInvalidFileType(true)
      setSelectedFile(undefined)
    }
  }

  const handleSaveButton = async (data: EditProfileFormProps) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('isAvatarDeleted', 'FALSE')

    if (selectedFile) {
      formData.append('file', selectedFile)
    }

    await handleUpdateProfile(formData)
  }

  const handleDeleteAvatarButton = async () => {
    const body: DeleteAvatarRequestInterface = {
      isAvatarDeleted: 'TRUE',
    }

    await handleUpdateProfile(body)
  }

  const handleUpdateProfile = async (
    body: DeleteAvatarRequestInterface | FormData
  ) => {
    try {
      setIsLoading(true)

      const {
        responseCode: _responseCode,
        responseStatus: _responseStatus,
        responseMessage: _responseMessage,
      } = await httpFetch({
        method: 'patch',
        url: '/user/profile',
        body: body,
      })

      if (body instanceof FormData) {
        console.log(body)
        // console.log(new FormData(body))
      } else {
        const updatedUser: FinalizeUser = {
          avatar: '',
          name: user?.name as string,
        }

        setAuthenticatedUser(updatedUser)
      }

      getToast({ type: 'success', message: 'Profile has been updated' })
      router.push('/')
    } catch (error) {
      const { statusCode } = getErrorMessage(error)

      if (statusCode === 401) {
        removeAccessToken(router)
      } else {
        getToast({})
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchTab = () => {
    setIsUpdateAvatar(!isUpdateAvatar)
  }

  return (
    <div className="px-12 md:px-8 mx-auto max-w-[550px] w-full bg-green-400 rounded-2xl h-fit">
      <div className="px-2 py-8 flex flex-col gap-4">
        <h1 className="text-center text-3xl font-bold">Edit Profile</h1>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <Tabs
              className="rounded-lg"
              onChange={handleSwitchTab}
              variant="unstyled"
            >
              <TabList>
                <Tab
                  className="rounded-l-lg text-white bg-blue-400"
                  _selected={{ color: 'white', bg: 'blue.500' }}
                >
                  Update
                </Tab>
                <Tab
                  className="rounded-r-lg text-white bg-red-400"
                  _selected={{ color: 'white', bg: 'red.500' }}
                >
                  Delete
                </Tab>
              </TabList>
            </Tabs>
            <p>Avatar</p>
          </div>

          {isUpdateAvatar ? (
            <>
              <CustomButton clasName="bg-blue-200 hover:bg-blue-100 py-2 w-full">
                <input
                  type="file"
                  className="w-full px-4"
                  onChange={onChangeFile}
                />
              </CustomButton>
              <p className="text-sm text-green-600" id="file_input_help">
                PNG, JPG, or JPEG (MAX 5 MB).
              </p>
              {invalidFileType && (
                <p className="text-sm text-red-600" id="file_input_help">
                  Invalid file type
                </p>
              )}
            </>
          ) : (
            <CustomButton
              onClick={handleDeleteAvatarButton}
              clasName="bg-red-500 hover:bg-red-400 py-2 w-full"
            >
              Delete Avatar
            </CustomButton>
          )}
        </div>

        <form
          onSubmit={handleSubmit(handleSaveButton)}
          className="flex flex-col gap-4"
        >
          <CustomTextInput
            label="Name"
            placeholder="Your Name"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="pt-2">
            <CustomButton
              className="w-full bg-lime-600 hover:bg-lime-500 py-2"
              type="submit"
              isDisabled={
                (!watch('name') && (!isUpdateAvatar || !selectedFile)) ||
                isLoading
              }
            >
              {(!watch('name') && (!isUpdateAvatar || !selectedFile)) ||
              !isLoading
                ? 'Save'
                : 'Loading'}
            </CustomButton>
          </div>
        </form>

        <CustomButton
          onClick={() => router.push('/')}
          className="w-full bg-zinc-500 hover:bg-zinc-400 py-2"
        >
          Back to Home
        </CustomButton>
      </div>
    </div>
  )
}
