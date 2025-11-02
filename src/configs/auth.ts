import { env } from "@/env";

export const authConfig = {
    jwt: {
        expiresIn: "1d",
        secret: env.JWT_SECRET
    }
}