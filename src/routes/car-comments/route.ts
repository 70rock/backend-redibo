import { Router, Request, Response } from "express"
import { prisma } from "../../lib/prisma"
import { getUserId } from "../../lib/auth"

const router = Router()


router.get("/", async (req: Request, res: Response) => {
  try {
    const { carId } = req.query

    if (!carId) {
      return res.status(400).json({ error: "ID del vehículo es requerido" })
    }

    
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" })
    }

    
    const comments = await prisma.review.findMany({
      where: { carId: carId as string },
      include: {
        renter: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return res.json(comments)
  } catch (error: any) {
    console.error("Error al obtener comentarios:", error)
    return res.status(500).json({ error: error.message || "Error al obtener comentarios" })
  }
})


router.post("/", async (req: Request, res: Response) => {
  try {
    const { carId, comment, rating } = req.body

    if (!carId || !comment) {
      return res.status(400).json({ error: "Faltan campos requeridos" })
    }

   
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" })
    }

    
    const renter = await prisma.renter.findFirst({
      where: { id: userId }
    })

    if (!renter) {
      return res.status(403).json({ error: "Solo los arrendatarios pueden dejar comentarios" })
    }

    
    const newComment = await prisma.review.create({
      data: {
        carId,
        renterId: userId,
        comment,
        rating: rating || 0
      },
      include: {
        renter: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        }
      }
    })

    return res.json(newComment)
  } catch (error: any) {
    console.error("Error al crear comentario:", error)
    return res.status(500).json({ error: error.message || "Error al crear comentario" })
  }
})

export default router 