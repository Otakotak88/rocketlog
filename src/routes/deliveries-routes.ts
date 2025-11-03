import { Router } from "express"

import { DeliveriesController } from "@/controllers/deliveries-controller"
import { UserRole } from "@prisma/client"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"
import { AdminDeliveriesController } from "@/controllers/admin-deliveries-controller"

const deliveriesRoutes = Router()
const deliveriesController = new DeliveriesController()
const adminDeliveriesController = new AdminDeliveriesController()

deliveriesRoutes.use(ensureAuthenticated)

// Any user
deliveriesRoutes.get(
    "/",
    verifyUserAuthorization([UserRole.admin, UserRole.sale, UserRole.customer]),
    deliveriesController.index
)

// Sale/Admin
deliveriesRoutes.post(
    "/", 
    verifyUserAuthorization([UserRole.admin, UserRole.sale]), 
    deliveriesController.create
)
deliveriesRoutes.patch(
    "/:delivery_id/status", 
    verifyUserAuthorization([UserRole.admin, UserRole.sale]), 
    deliveriesController.update
)

// Admin only
deliveriesRoutes.get("/admin", verifyUserAuthorization([UserRole.admin]), adminDeliveriesController.index)

export { deliveriesRoutes }