import { Request, Response } from "express";
import { AppError } from "@/utils/app-error";
import { z } from "zod"

class UsersController{
    create(request: Request, response: Response){
        const bodySchema = z.object({
            name: z.string().trim().min(3),
            email: z.string().email(),
            password: z.string().min(6)
        })

        const { name, email, password } = bodySchema.parse(request.body)

        return response.status(201).json()
    }
}

export { UsersController }