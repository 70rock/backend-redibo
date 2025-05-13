import { Router, Request, Response } from "express"
import { prisma } from "../../lib/prisma"
import { getUserId } from "../../lib/auth"
import { EstadoReporte } from "@prisma/client"

const router = Router()


router.get("/", async (req: Request, res: Response) => {
  try {
    const { renterId, reporterId } = req.query

    
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" })
    }

    
    const whereClause: any = {}
    if (renterId) whereClause.renterId = renterId
    if (reporterId) whereClause.reporterId = reporterId

    
    const reports = await prisma.report.findMany({
      where: whereClause,
      include: {
        renter: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true
          }
        },
        reporter: {
          select: {
            nombre: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return res.json(reports)
  } catch (error: any) {
    console.error("Error al obtener reportes:", error)
    return res.status(500).json({ error: error.message || "Error al obtener reportes" })
  }
})


router.post("/", async (req: Request, res: Response) => {
  try {
    const { renterId, reason, additionalInfo } = req.body

    if (!renterId || !reason) {
      return res.status(400).json({ error: "Faltan campos requeridos" })
    }

   
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" })
    }

   
    const newReport = await prisma.report.create({
      data: {
        renterId,
        reporterId: userId,
        reason,
        additionalInfo,
        status: EstadoReporte.PENDIENTE
      },
      include: {
        renter: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true
          }
        },
        reporter: {
          select: {
            nombre: true,
            email: true,
            image: true
          }
        }
      }
    })

    return res.json(newReport)
  } catch (error: any) {
    console.error("Error al crear reporte:", error)
    return res.status(500).json({ error: error.message || "Error al crear reporte" })
  }
})

export default router