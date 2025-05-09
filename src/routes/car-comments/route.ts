import { Router, Request, Response } from "express"
import { prisma } from "../../lib/prisma"
import { getUserId } from "../../lib/auth"

const router = Router()

// GET /api/car-comments?carId=...
router.get("/", async (req: Request, res: Response) => {
  try {
    const { carId } = req.query

    if (!carId) {
      return res.status(400).json({ error: "Se requiere el ID del auto" })
    }

    // Obtener comentarios con información del auto y sus imágenes
    const comments = await prisma.carComment.findMany({
      where: {
        carId: carId as string
      },
      include: {
        renter: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        },
        car: {
          include: {
            imagenes: true,
            user: {
              select: {
                nombre: true,
                email: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return res.json(comments)
  } catch (error: any) {
    console.error("Error al obtener comentarios:", error)
    return res.status(500).json({ error: error.message || "Error al obtener comentarios" })
  }
})

// POST /api/car-comments
router.post("/", async (req: Request, res: Response) => {
  try {
    const { carId, comment, rating } = req.body

    if (!carId || !comment) {
      return res.status(400).json({ error: "Faltan campos requeridos" })
    }

    // Verificar autenticación
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" })
    }

    // Crear comentario
    const newComment = await prisma.carComment.create({
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
        },
        car: {
          include: {
            imagenes: true,
            user: {
              select: {
                nombre: true,
                email: true,
                image: true
              }
            }
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