import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../lib/auth';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['auth-token'];
  
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const decoded = await verifyJWT(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded; // Añade el usuario decodificado a la request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}; 