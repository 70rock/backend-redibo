import { Router, Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import { getUserId } from "../../../lib/auth"

const router = Router()

// GET /api/rentals/completed?hostId=...
router.get("/", async (req: Request, res: Response) => {
  try {
    const { hostId } = req.query

    if (!hostId) {
      return res.status(400).json({ error: "Host ID es requerido" })
    }

    // Verificar autenticación
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" })
    }

    // Obtener rentas completadas con información del renter
    const completedRentals = await prisma.reservation.findMany({
      where: {
        hostId: hostId as string,
        estado: "COMPLETADA",
      },
      include: {
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profilePicture: true,
          },
        },
        car: {
          select: {
            marca: true,
            modelo: true,
            imagenes: {
              select: {
                url: true
              }
            }
          },
        },
      },
      orderBy: { fechaFin: "desc" },
    })

    return res.json(completedRentals)
  } catch (error: any) {
    console.error("Error al obtener rentas completadas:", error)
    return res.status(500).json({ error: error.message || "Error al obtener rentas completadas" })
  }
})

export default router
