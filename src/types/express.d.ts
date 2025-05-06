import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Puedes tipar esto más específicamente según tus necesidades
    }
  }
} 