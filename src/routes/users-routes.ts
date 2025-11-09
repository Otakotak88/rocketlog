import { Router } from "express";

import { UsersController } from "@/controllers/users-controller";
import { AdminUsersController } from "@/controllers/admin-users-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { UserRole } from "@prisma/client";

const userRoutes = Router()
const usersController = new UsersController()
const adminUsersController = new AdminUsersController()

userRoutes.post("/", usersController.create)
userRoutes.post("/admin", ensureAuthenticated, verifyUserAuthorization([UserRole.admin]), adminUsersController.create)

export { userRoutes }