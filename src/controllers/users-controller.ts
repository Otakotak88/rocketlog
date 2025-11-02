import { Request, Response } from "express";
import { AppError } from "@/utils/app-error";
import { prisma } from "@/database/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod"
import { hash } from "bcrypt"

class UsersController{
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            name: z.string().trim().min(3),
            email: z.string().email(),
            password: z.string().min(6)
        })

        const { name, email, password } = bodySchema.parse(request.body)

        const userWithSameEmail = await prisma.user.findFirst({ where: { email }})

        if(userWithSameEmail){
            throw new AppError("Usuário com email já cadastrado")
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({ 
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        const { password: _, ...userWithoutPassword } = user

        return response.status(201).json(userWithoutPassword)
    }
}

export { UsersController }