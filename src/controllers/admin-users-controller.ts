import { Request, Response } from "express"
import { AppError } from "@/utils/app-error"
import { prisma } from "@/database/prisma"
import { z } from "zod"
import { UserRole } from "@prisma/client"
import { hash } from "bcrypt"

class AdminUsersController{
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(6),
            role: z.enum([UserRole.admin, UserRole.sale, UserRole.customer])
        })

        const { name, email, password, role } = bodySchema.parse(request.body)

        const userWithSameEmail = await prisma.user.findFirst({ where: { email }})

        if(userWithSameEmail){
            throw new AppError("Usuário com email já cadastrado")
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        })

        const { password: _, ...userWithoutPassword } = user

        return response.status(201).json(userWithoutPassword)
    }
}

export { AdminUsersController }