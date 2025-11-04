import request from "supertest"

import { app } from "@/app"
import { prisma } from "@/database/prisma"

describe("Users", () => {
    let user_id: string

    afterAll( async () => {
        await prisma.user.delete({
            where: {
                id: user_id
            }
        })
    })
    
    it("should create a new user", async () => {
        const response = await request(app).post("/users").send({
            name: "Test User",
            email: "testuser@example.com",
            password: "123456"
        })

        user_id = response.body.id

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
        expect(response.body.name).toBe("Test User")
    })

    it("should not validate the email and throw an error", async () => {
        const response = await request(app).post("/users").send({
            name: "Same Email User",
            email: "testuser@example.com",
            password: "123456"
        })
        
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Usuário com email já cadastrado")
    })

    it("should validate the body and throw an error", async () => {
        const response = await request(app).post("/users").send({
            name: "No Password User",
            email: "nopassword@example.com"
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Validation error")
    })
})