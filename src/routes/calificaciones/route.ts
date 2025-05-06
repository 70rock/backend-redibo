import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";

const router = Router();

// GET /api/calificaciones?calificadorId=...&calificadoId=...&reservationId=...
router.get("/", async (req: Request, res: Response) => {
  try {
    const { calificadorId, calificadoId, reservationId } = req.query;

    const where: any = {};
    if (calificadorId) where.calificadorId = calificadorId;
    if (calificadoId) where.calificadoId = calificadoId;
    if (reservationId) where.reservationId = reservationId;

    const calificaciones = await prisma.calificacionHostUsuario.findMany({
      where,
      include: {
        calificador: true, // User
        calificado: true,  // Renter
        reservation: true,
      },
      orderBy: { fechaCreacion: "desc" }
    });

    return res.json(calificaciones);
  } catch (error) {
    console.error("Error al obtener calificaciones:", error);
    return res.status(500).json({ error: "Error al obtener calificaciones" });
  }
});

// POST /api/calificaciones
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Verificar que el calificador (User) existe
    const calificador = await prisma.user.findUnique({
      where: { id: data.calificadorId }
    });
    if (!calificador) {
      return res.status(404).json({ error: "Calificador no encontrado" });
    }

    // Verificar que el calificado (Renter) existe
    const calificado = await prisma.renter.findUnique({
      where: { id: data.calificadoId }
    });
    if (!calificado) {
      return res.status(404).json({ error: "Calificado no encontrado" });
    }

    // Crear la calificación
    const nueva = await prisma.calificacionHostUsuario.create({
      data: {
        comportamiento: data.comportamiento,
        cuidadoVehiculo: data.cuidadoVehiculo,
        puntualidad: data.puntualidad,
        comentario: data.comentario,
        reservationId: data.reservationId,
        calificadorId: data.calificadorId,
        calificadoId: data.calificadoId
      }
    });
    return res.json(nueva);
  } catch (error) {
    console.error("Error al crear calificación:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Error desconocido" });
  }
});

export default router;