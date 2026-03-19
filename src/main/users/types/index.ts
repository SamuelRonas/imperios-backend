import { z } from "zod"

export const createUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

export const userSchema = z.object({
  userID: z.string(),
  email: z.email(),
  passwordHash: z.string(),
  createdAt: z.number().default(() => Date.now())
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type Users = z.infer<typeof userSchema>