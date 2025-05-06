import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();

// GET /api/renter-details?renterId=...
router.get("/", async (req: Request, res: Response) => {
  const { renterId } = req.query;
  if (!renterId) {
    return res.status(400).json({ error: "Falta el renterId" });
  }
  try {
    const renter = await prisma.renter.findUnique({
      where: { id: renterId as string },
      include: { reviews: { orderBy: { createdAt: "desc" } } },
    });
    return res.json(renter);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el arrendatario" });
  }
});

export default router; 