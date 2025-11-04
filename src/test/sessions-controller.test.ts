import request from "supertest"

import { app } from "@/app"
import { prisma } from "@/database/prisma"

import { verify } from "jsonwebtoken"
import { env } from "@/env"

describe("Sessions", () => {
    let user_id: string

    // Create test user
    beforeAll(async () => {
        const userResponse = await request(app).post("/users").send({
            name: "Test User",
            email: "testuser@example.com",
            password: "123456"
        })

        user_id = userResponse.body.id
    })

    // Delete test user
    afterAll(async () => {
        await prisma.user.delete({
            where: {
                id: user_id
            }
        }) 
    })

    it("should create a session, return and validate the token", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "testuser@example.com",
            password: "123456"
        })

        expect(sessionResponse.status).toBe(201)
        expect(sessionResponse.body).toHaveProperty("token")

        // Validates the token
        expect(verify(sessionResponse.body.token, env.JWT_SECRET)).toEqual(expect.any(Object))
    })

    it("should check if the messages of invalid email and wrong password are the same", async () => {
        const wrongEmailResponse = await request(app).post("/sessions").send({
            email: "wrongEmail@example.com",
            password: "123456"
        })
        
        const wrongPasswordResponse = await request(app).post("/sessions").send({
            email: "testuser@example.com",
            password: "654321"
        })

        const message = "Usuário e/ou senha estão incorretos"

        expect(wrongEmailResponse.status).toBe(400)
        expect(wrongPasswordResponse.status).toBe(400)

        expect(wrongEmailResponse.body.message).toBe(message)
        expect(wrongPasswordResponse.body.message).toBe(message)
    })

    it("should not validate the password", async () => {
        const response = await request(app).post("/sessions").send({
            email: "testuser@example.com",
            password: ""
        })

        expect(response.status).toBe(400)
        expect(response.body.issues).toHaveProperty("password")
    })

    it("should not validate the email", async () => {
        const response = await request(app).post("/sessions").send({
            email: "",
            password: "123456"
        })

        expect(response.status).toBe(400)
        expect(response.body.issues).toHaveProperty("email")
    })
})