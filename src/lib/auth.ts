import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { prisma } from "./prisma"
import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function signUp(req: Request, res: Response) {
  const { email, password, name } = req.body
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return res.status(400).json({ error: "El correo electrónico ya está registrado" })
  }
  const hashedPassword = await hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nombre: name || email.split("@")[0],
    },
  })
  const token = sign({ id: user.id, email: user.email, name: user.nombre }, JWT_SECRET, { expiresIn: "7d" })
  res.cookie("auth-token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7 días en ms
    path: "/",
  })
  res.json({ user: { id: user.id, email: user.email, name: user.nombre } })
}

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" })
  }
  const passwordValid = await compare(password, user.password || "")
  if (!passwordValid) {
    return res.status(401).json({ error: "Credenciales inválidas" })
  }
  const token = sign({ id: user.id, email: user.email, name: user.nombre }, JWT_SECRET, { expiresIn: "7d" })
  res.cookie("auth-token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000,
    path: "/",
  })
  res.json({ user: { id: user.id, email: user.email, name: user.nombre } })
}

export function signOut(req: Request, res: Response) {
  res.clearCookie("auth-token")
  res.json({ message: "Sesión cerrada" })
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["auth-token"]
  if (!token) {
    return res.status(401).json({ error: "No autenticado" })
  }
  try {
    const decoded = verify(token, JWT_SECRET) as { id: string; email: string; name?: string }
    (req as any).user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" })
  }
}

export function getSession(req: Request, res: Response) {
  const token = req.cookies["auth-token"];
  if (!token) return res.status(401).json({ user: null });
  try {
    const decoded = verify(token, JWT_SECRET) as { id: string; email: string; name?: string };
    return res.json({ user: decoded });
  } catch {
    return res.status(401).json({ user: null });
  }
}

export function getUserId(req: Request): string | null {
  const token = req.cookies["auth-token"]
  if (!token) return null
  try {
    const decoded = verify(token, JWT_SECRET) as { id: string; email: string; name?: string }
    return decoded.id
  } catch {
    return null
  }
}

export const verifyJWT = (token: string, secret: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const generateJWT = (payload: any, secret: string): string => {
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};
