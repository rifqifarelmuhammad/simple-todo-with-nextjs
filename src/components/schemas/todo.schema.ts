import * as z from 'zod'

export const createTodoSchema = z.object({
  title: z.string({ required_error: `Please fill out todo's title` }),
  description: z.string().optional(),
})
