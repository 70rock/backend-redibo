import { Router, Request, Response } from "express"
import { prisma } from "../../lib/prisma"
import { getUserId } from "../../lib/auth"

const router = Router()

// GET /api/reservations?hostId=...&page=...&limit=...&sortKey=...&sortDirection=...
router.get("/", async (req: Request, res: Response) => {
  try {
    const { hostId, page = "1", limit = "10", sortKey, sortDirection } = req.query

    if (!hostId) {
      return res.status(400).json({ error: "Host ID es requerido" })
    }

    // Verificar autenticación
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" })
    }

    // Calcular el offset para la paginación
    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)
    const skip = (pageNum - 1) * limitNum

    // Configurar ordenamiento
    let orderBy: any = { createdAt: "desc" }
    if (sortKey) {
      orderBy = {}
      orderBy[sortKey as string] = sortDirection === "ascending" ? "asc" : "desc"
    }

    // Obtener las reservaciones con paginación
    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where: { hostId: hostId as string },
        skip,
        take: limitNum,
        orderBy,
        include: {
          renter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          car: {
            select: {
              marca: true,
              modelo: true,
            },
          },
        },
      }),
      prisma.reservation.count({ where: { hostId: hostId as string } }),
    ])

    // Formatear los datos para el componente
    const formattedReservations = reservations.map((res) => ({
      id: res.id,
      marca: res.car?.marca ?? "",
      modelo: res.car?.modelo ?? "",
      fechaInicio: res.fechaInicio,
      fechaFin: res.fechaFin,
      estado: res.estado,
      renter: res.renter
        ? {
            id: res.renter.id,
            firstName: res.renter.firstName,
            lastName: res.renter.lastName,
            email: res.renter.email,
            phone: res.renter.phone,
          }
        : null,
    }))

    return res.json({
      data: formattedReservations,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error: any) {
    console.error("Error al obtener reservaciones:", error)
    return res.status(500).json({ 
      error: error.message || "Error al obtener reservaciones",
      code: error.code || 'UNKNOWN_ERROR'
    })
  }
})

export default router
