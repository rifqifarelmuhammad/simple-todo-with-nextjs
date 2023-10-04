export interface EditProfileFormProps {
  name: string
}

export interface EditProfileRequestInterface extends EditProfileFormProps {
  avatar?: File
  isAvatarDeleted: string
}
