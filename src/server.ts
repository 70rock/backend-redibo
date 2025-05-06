import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import cookieParser from "cookie-parser";
import { requireAuth } from './middleware/auth';
import signinRoutes from './routes/auth/signin/route';
import signupRoutes from './routes/auth/signup/route';
import signoutRoutes from './routes/auth/signout/route';
import sessionRoutes from './routes/auth/session/route';
// import authRoutes from './routes/auth';

import calificacionesRoutes from './routes/calificaciones/route';
import calificacionesIdRoutes from './routes/calificaciones/[id]/route';

import rentalsCompletedRoutes from './routes/rentals/completed/route';

import renterDetailsRoutes from './routes/renter-details/route';
import reservationsRoutes from './routes/reservations/route';

import reviewsRoutes from './routes/reviews/route';
import reviewsIdRoutes from './routes/reviews/[id]/route';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 4000;

// Configuración recomendada para desarrollo:
app.use(cors({
  origin: 'http://localhost:3000', // Cambia al puerto de tu frontend si es diferente
  credentials: true, // Permite el uso de cookies/sesión
}));

app.use(express.json());
app.use(cookieParser());

// Aplicar middleware de autenticación a rutas protegidas
app.use('/api/reservations', requireAuth, reservationsRoutes);
app.use('/api/renter-details', requireAuth, renterDetailsRoutes);
app.use('/api/reviews', requireAuth, reviewsRoutes);
app.use('/api/reviews', requireAuth, reviewsIdRoutes);
app.use('/api/calificaciones', requireAuth, calificacionesRoutes);
app.use('/api/calificaciones', requireAuth, calificacionesIdRoutes);
app.use('/api/rentals/completed', requireAuth, rentalsCompletedRoutes);

// Rutas de autenticación individuales
app.use('/api/auth/signin', signinRoutes);
app.use('/api/auth/signup', signupRoutes);
app.use('/api/auth/signout', signoutRoutes);
app.use('/api/auth/session', sessionRoutes);

// Rutas de reservaciones
app.get('/api/reservations', async (req: express.Request, res: express.Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        car: true,
        renter: true
      }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservaciones' });
  }
});

// Rutas de autos
app.get('/api/cars', async (req: express.Request, res: express.Response) => {
  try {
    const cars = await prisma.car.findMany();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los autos' });
  }
});

// Rutas de usuarios
app.get('/api/users', async (req: express.Request, res: express.Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Rutas de reseñas
app.get('/api/reviews', async (req: express.Request, res: express.Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        renter: true,
        host: true
      }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reseñas' });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
}); 