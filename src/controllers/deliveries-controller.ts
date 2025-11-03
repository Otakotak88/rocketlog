import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod"
import { AppError } from "@/utils/app-error";
import { DeliveryStatus } from "@prisma/client";

class DeliveriesController{
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            user_id: z.string().uuid(),
            description: z.string(),
        })

        const { user_id, description } = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({
            where: {
                id: user_id
            }
        })

        if(!user){
            throw new AppError("User not found", 404)
        }

        await prisma.delivery.create({
            data: {
                userId: user_id,
                description
            }
        })

        return response.status(201).json()
    }

    async index(request: Request, response: Response){
        const user_id = request.user?.id

        const deliveries = await prisma.delivery.findMany({
            where: {
                userId: user_id
            }
        })

        return response.json(deliveries)
    }

    async update(request: Request, response: Response){
        const bodySchema = z.object({
            status: z.enum([DeliveryStatus.delivered, DeliveryStatus.processing, DeliveryStatus.shipped])
        })

        const paramsSchema = z.object({
            delivery_id: z.string().uuid()
        })

        const { status } = bodySchema.parse(request.body)

        const { delivery_id } = paramsSchema.parse(request.params)

        await prisma.delivery.update({
            data: {
                status
            },
            where: {
                id: delivery_id
            }
        })

        await prisma.deliveryLog.create({
            data: {
                deliveryId: delivery_id,
                description: status
            }
        })

        return response.json()
    }
}

export { DeliveriesController }