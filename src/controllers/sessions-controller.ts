import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { z } from "zod";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";

class SessionsController{
    async create(request: Request, response: Response){
        // Validação de usuário
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6)
        })

        const { email, password } = bodySchema.parse(request.body)

        const user = await prisma.user.findFirst({ where: { email } })

        if(!user){
            throw new AppError("Usuário e/ou senha estão incorretos")
        }

        const isPasswordCorrect = await compare(password, user.password)

        if(!isPasswordCorrect){
            throw new AppError("Usuário e/ou senha estão incorretos")
        }

        // Gerando token
        const { secret, expiresIn } = authConfig.jwt

        const token = sign({ role: user.role ?? "customer" }, secret, {
            expiresIn,
            subject: user.id
        })

        const { password: _, ...userWithoutPassword } = user

        return response.status(201).json({token, user: userWithoutPassword})
    }
}

export { SessionsController }