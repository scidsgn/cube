import { PrismaClient } from "@/apis/prisma/client"
import { databaseUrl } from "@/app/env"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const adapter = new PrismaPg({
    connectionString: databaseUrl,
})

const prisma = new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export const db = prisma
