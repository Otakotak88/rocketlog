import { Router } from "express";

import { DeliveryLogsController } from "@/controllers/delivery-logs-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { UserRole } from "@prisma/client";

const deliveryLogsRoutes = Router()
const deliveryLogsController = new DeliveryLogsController()

deliveryLogsRoutes.use(ensureAuthenticated)

// Any user
deliveryLogsRoutes.get(
    "/:delivery_id", 
    verifyUserAuthorization([UserRole.admin, UserRole.sale, UserRole.customer]),
    deliveryLogsController.show
)

// Sale/Admin
deliveryLogsRoutes.post(
    "/", 
    verifyUserAuthorization([UserRole.admin, UserRole.sale]), 
    deliveryLogsController.create
)

export { deliveryLogsRoutes }