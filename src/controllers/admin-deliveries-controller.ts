import { Request, Response } from "express";
import { prisma } from "@/database/prisma";

class AdminDeliveriesController{
    async index(request: Request, response: Response){
        const deliveries = await prisma.delivery.findMany({
            include: {
                user: {
                    select: {
                        name: true, 
                        email: true
                    }
                }
            }
        })

        return response.json(deliveries)
    }
}

export { AdminDeliveriesController }