import { Router, Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import { Prisma } from "@prisma/client"

const router = Router()

// PUT /api/calificaciones/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = req.body
    
    // Verificar que la calificación existe
    const calificacion = await prisma.calificacionHostUsuario.findUnique({
      where: { id }
    })
    
    if (!calificacion) {
      return res.status(404).json({ error: "Calificación no encontrada" })
    }
    
    // Actualizar la calificación
    const updated = await prisma.calificacionHostUsuario.update({
      where: { id },
      data: {
        comportamiento: data.comportamiento,
        cuidadoVehiculo: data.cuidadoVehiculo,
        puntualidad: data.puntualidad,
        comentario: data.comentario,
      }
    })
    
    return res.json(updated)
  } catch (error) {
    console.error("Error al actualizar calificación:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({ error: error.message })
    }
    return res.status(500).json({ error: "Error desconocido" })
  }
})

// DELETE /api/calificaciones/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // Verificar que la calificación existe
    const calificacion = await prisma.calificacionHostUsuario.findUnique({
      where: { id }
    })
    
    if (!calificacion) {
      return res.status(404).json({ error: "Calificación no encontrada" })
    }
    
    // Eliminar la calificación
    await prisma.calificacionHostUsuario.delete({ where: { id } })
    
    return res.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar calificación:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({ error: error.message })
    }
    return res.status(500).json({ error: "Error desconocido" })
  }
})

export default router 