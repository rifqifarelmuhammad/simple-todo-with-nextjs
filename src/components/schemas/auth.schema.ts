import * as z from 'zod'

export const registrationSchema = z
  .object({
    name: z.string({ required_error: 'Please fill out your name' }),
    email: z
      .string({ required_error: 'Please fill out your email' })
      .email({ message: 'Invalid email' }),
    password: z
      .string({ required_error: 'Please fill out your password' })
      .min(8, { message: 'The password must contain at least 8 characters' }),
    confirmationPassword: z.string({
      required_error: 'Please fill out your confirmation password',
    }),
  })
  .refine(
    ({ password, confirmationPassword }) => password === confirmationPassword,
    {
      message: 'Password does not match',
      path: ['confirmationPassword'],
    }
  )

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Please fill out your email' })
    .email({ message: 'Invalid email' }),
  password: z
    .string({ required_error: 'Please fill out your password' })
    .min(8, { message: 'The password must contain at least 8 characters' }),
})
