import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/:hostId', async (req: Request, res: Response) => {
    const { hostId } = req.params;
    
    try {
      const cars = await prisma.car.findMany({
        where: {
          userId: hostId
        },
        select: {
          id: true,
          vin: true,
          año: true,
          marca: true,
          modelo: true,
          placa: true,
          asientos: true,
          puertas: true,
          soat: true,
          precioPorDia: true,
          numMantenimientos: true,
          transmision: true,
          estado: true,
          direccion: true,
          ciudad: true,
          provincia: true,
          pais: true,
          combustibles: { select: { tipoDeCombustible: true } },
          caracteristicas: { select: { nombre: true } },
          imagenes: { select: { url: true } }
        }
      });
  
      if (!cars.length) {
        return res.status(404).json({ 
          message: "No se encontraron autos para este host",
          hostId
        });
      }
  
      const formattedCars = cars.map(car => ({
        ...car,
        precio_por_dia: car.precioPorDia,
        num_mantenimientos: car.numMantenimientos ?? 0,
        transmicion: car.transmision ?? 'No especificado',
        estado: car.estado === 'DISPONIBLE' ? 'Disponible' : 
               car.estado === 'RESERVADO' ? 'Reservado' : 'En mantenimiento',
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