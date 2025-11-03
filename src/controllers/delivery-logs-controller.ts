import { Request, Response } from "express";
import { z } from "zod"
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";

import { DeliveryStatus, UserRole } from "@prisma/client";

class DeliveryLogsController{
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            delivery_id: z.string().uuid(),
            description: z.string()
        })

        const { delivery_id, description } = bodySchema.parse(request.body)

        const delivery = await prisma.delivery.findUnique({
            where: {
                id: delivery_id
            }
        })

        if(!delivery){
            throw new AppError("Delivery not found", 404)
        }

        if(delivery.status === DeliveryStatus.processing){
            throw new AppError("Change delivery status to shipped")
        }

        if(delivery.status === DeliveryStatus.delivered){
            throw new AppError("Delivery already complete")
        }

        await prisma.deliveryLog.create({
            data: {
                deliveryId: delivery_id,
                description
            }
        })

        return response.status(201).json()
    }

    async show(request: Request, response: Response){
        const paramsSchema = z.object({
            delivery_id: z.string().uuid()
        })

        const { delivery_id } = paramsSchema.parse(request.params)

        const delivery = await prisma.delivery.findUnique({
            where: {
                id: delivery_id
            },
            include: {
                logs: true
            }
        })

        if(!delivery){
            throw new AppError("Delivery not found", 404)
        }

        if(request.user?.role === UserRole.customer && request.user.id !== delivery.userId){
            throw new AppError("Delivery cannot be viewed by different user", 401)
        }

        return response.json(delivery)
    }
}

export { DeliveryLogsController }