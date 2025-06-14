import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address"
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    })
})

export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }),
    email: z.string().email({
        message: "Please enter a valid email address"
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    })
})

export const ProfileUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    image: z.any().optional() // For file upload
})

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema> 