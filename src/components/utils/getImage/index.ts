export const getImage = (public_id: string) => {
  return `${process.env.NEXT_PUBLIC_CLOUDINARY_API_URL}/${public_id}`
}
