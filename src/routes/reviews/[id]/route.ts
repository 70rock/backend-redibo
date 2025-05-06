import { Router, Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import { getUserId } from "../../../lib/auth"

const router = Router()

// PUT /api/reviews/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { behaviorRating, carCareRating, punctualityRating, rating, comment } = req.body

    if (!id) {
      return res.status(400).json({ error: "ID es requerido" })
    }

    // Verificar autenticación
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" })
    }

    // Verificar que la reseña pertenezca al usuario
    const existingReview = await prisma.review.findUnique({
      where: { id },
    })

    if (!existingReview || existingReview.hostId !== userId) {
      return res.status(403).json({ error: "No autorizado para editar esta reseña" })
    }

    // Actualizar reseña
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        behaviorRating: behaviorRating || existingReview.behaviorRating,
        carCareRating: carCareRating || existingReview.carCareRating,
        punctualityRating: punctualityRating || existingReview.punctualityRating,
        rating: rating || existingReview.rating,
        comment: comment !== undefined ? comment : existingReview.comment,
        updatedAt: new Date(),
      },
    })

    // Actualizar rating promedio del arrendatario
    const reviews = await prisma.review.findMany({
      where: { renterId: existingReview.renterId },
    })

    const avgRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length

    await prisma.renter.update({
      where: { id: existingReview.renterId },
      data: { rating: avgRating },
    })

    return res.json(updatedReview)
  } catch (error: any) {
    console.error("Error al actualizar reseña:", error)
    return res.status(500).json({ error: error.message || "Error al actualizar reseña" })
  }
})

// DELETE /api/reviews/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: "ID es requerido" })
    }

    // Verificar autenticación
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" })
    }

    // Verificar que la reseña pertenezca al usuario
    const existingReview = await prisma.review.findUnique({
      where: { id },
    })

    if (!existingReview || existingReview.hostId !== userId) {
      return res.status(403).json({ error: "No autorizado para eliminar esta reseña" })
    }

    // Eliminar reseña
    await prisma.review.delete({
      where: { id },
    })

    // Actualizar rating promedio del arrendatario
    const reviews = await prisma.review.findMany({
      where: { renterId: existingReview.renterId },
    })

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length

      await prisma.renter.update({
        where: { id: existingReview.renterId },
        data: { rating: avgRating },
      })
    }

    return res.json({ success: true })
  } catch (error: any) {
    console.error("Error al eliminar reseña:", error)
    return res.status(500).json({ error: error.message || "Error al eliminar reseña" })
  }
})

export default router
