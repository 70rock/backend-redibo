import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { getUserId } from "../../lib/auth"

const router = Router();

router.get('/:hostId', async (req: Request, res: Response) => {
    const { hostId } = req.params;

    // Verificar autenticación
    //const userId = getUserId(req)
    //if (!userId) {
    //  return res.status(401).json({ error: "No autorizado" })
    //}
    
    try {
      const cars = await prisma.$queryRaw<any[]>`
        SELECT 
          c.id, c.vin, c.año, c.marca, c.modelo, c.placa,
          c.asientos, c.puertas, c.soat, c."precioPorDia" as "precioPorDia",
          c."numMantenimientos", c.transmision, c.estado,
          c.direccion, c.ciudad, c.provincia, c.pais,
          (
            SELECT json_agg(json_build_object('tipoDeCombustible', cb."tipoDeCombustible"))
            FROM "Combustible" cb WHERE cb."carId" = c.id
          ) as combustibles,
          (
            SELECT json_agg(json_build_object('nombre', ca.nombre))
            FROM "CaracteristicaAdicional" ca WHERE ca."carId" = c.id
          ) as caracteristicas
        FROM "Car" c
        WHERE c."userId" = ${hostId}
      `;
  
      if (!cars.length) {
        return res.status(404).json({ 
          message: "No se encontraron autos para este host",
          hostId
        });
      }
  
      const formattedCars = cars.map(car => ({
        id: car.id,
        vin: car.vin || null,
        año: car.año,
        marca: car.marca,
        modelo: car.modelo,
        placa: car.placa || null,
        asientos: car.asientos || null,
        puertas: car.puertas || null,
        soat: car.soat || null,
        precio_por_dia: car.precioPorDia || 0,
        num_mantenimientos: car.numMantenimientos || 0,
        transmision: car.transmision || 'No especificado',
        estado: car.estado === 'DISPONIBLE' ? 'Disponible' : 
               car.estado === 'RESERVADO' ? 'Reservado' : 'En mantenimiento',
        direccion: car.direccion || null,
        ciudad: car.ciudad || null,
        provincia: car.provincia || null,
        pais: car.pais || null,
        combustibles: car.combustibles || [],
        caracteristicas: car.caracteristicas || [],
        tiene_placa: !!car.placa
      }));
  
      res.json({
        total: cars.length,
        autos_con_placa: cars.filter(c => c.placa).length,
        autos: formattedCars
      });
    } catch (error: unknown) {
      console.error("Error:", error);
      if (error instanceof Error) {
        res.status(500).json({ 
          error: "Error en el servidor",
          details: process.env.NODE_ENV === 'development' ? {
            message: error.message,
            stack: error.stack
          } : null
        });
      } else {
        res.status(500).json({ 
          error: "Error desconocido en el servidor"
        });
      }
    }
});

export default router;