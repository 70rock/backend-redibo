import { Router, Request, Response } from "express"
import { prisma } from "../../lib/prisma"
import { getUserId } from "../../lib/auth"

const router = Router()


router.get("/", async (req: Request, res: Response) => {
  try {
    const { hostId, renterId } = req.query

    if (!hostId && !renterId) {
      return res.status(500).json({ error: "Host ID o Renter ID es requerido" })
    }

    
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" })
    }

   
    const whereClause: any = {}
    if (hostId) whereClause.hostId = hostId
    if (renterId) whereClause.renterId = renterId

    // Obtener reseñas
    const reviews = await prisma.review.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    })

    return res.json(reviews)
  } catch (error: any) {
    console.error("Error al obtener reseñas:", error)
    return res.status(500).json({ error: error.message || "Error al obtener reseñas" })
  }
})

// POST /api/reviews
router.post("/", async (req: Request, res: Response) => {
  try {
    const { reservationId, renterId, behaviorRating, carCareRating, punctualityRating, rating, comment, renterName } = req.body

    if (!reservationId || !renterId || !rating) {
      return res.status(400).json({ error: "Faltan campos requeridos" })
    }

    // Verificar autenticación
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" })
    }

    // Obtener información del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    })

    // Crear reseña
    const newReview = await prisma.review.create({
      data: {
        reservationId,
        renterId,
        hostId: userId,
        behaviorRating: behaviorRating || rating,
        carCareRating: carCareRating || rating,
        punctualityRating: punctualityRating || rating,
        rating,
        comment,
        hostName: user?.name || "Usuario",
        renterName: renterName || "Arrendatario",
      },
    })

   
    const reviews = await prisma.review.findMany({
      where: { renterId },
      orderBy: { createdAt: "desc"},
      include: {
        car: {
          include: {
            imagenes: true
          }
        }
      }
    })

    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

   

    await prisma.renter.update({
      where: { id: renterId },
      data: { rating: avgRating },
    })

    return res.json(newReview)
  } catch (error: any) {
    console.error("Error al crear reseña:", error)
    return res.status(500).json({ error: error.message || "Error al crear reseña" })
  }
})

export default router