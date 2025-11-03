import { AppError } from "@/utils/app-error"
import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import { env } from "@/env"

interface TokenPayload {
    role: string
    sub: string
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction){
    const authHeader = request.headers.authorization

    if(!authHeader){
        throw new AppError("JWT token not found", 401)
    }

    const [ , token ] = authHeader.split(" ")

    const { sub: user_id, role } = verify(token, env.JWT_SECRET) as TokenPayload

    request.user = {
        id: user_id,
        role
    }

    next()
}

export { ensureAuthenticated }