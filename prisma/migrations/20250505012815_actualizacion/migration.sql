/*
  Warnings:

  - You are about to drop the column `anio` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `marca` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `modelo` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `nombreUsuario` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "anio",
DROP COLUMN "marca",
DROP COLUMN "modelo",
DROP COLUMN "nombreUsuario",
ADD COLUMN     "carId" TEXT,
ADD COLUMN     "descuentoId" TEXT,
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaExpiracion" TIMESTAMP(3),
ALTER COLUMN "estado" SET DEFAULT 'pendiente';

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "carId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3),
ADD COLUMN     "genero" "Genero",
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "nombre" TEXT,
ADD COLUMN     "pais" TEXT,
ADD COLUMN     "provincia" TEXT,
ADD COLUMN     "telefono" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "vim" TEXT,
    "año" INTEGER,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "placa" TEXT,
    "asientos" INTEGER,
    "puertas" INTEGER,
    "soat" BOOLEAN,
    "precioPorDia" DOUBLE PRECISION,
    "numMantenimientos" INTEGER,
    "transmision" TEXT,
    "estado" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "provincia" TEXT,
    "pais" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Combustible" (
    "id" TEXT NOT NULL,
    "tipoDeCombustible" TEXT NOT NULL,
    "carId" TEXT NOT NULL,

    CONSTRAINT "Combustible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaracteristicaAdicional" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "carId" TEXT NOT NULL,

    CONSTRAINT "CaracteristicaAdicional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imagen" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "carId" TEXT NOT NULL,

    CONSTRAINT "Imagen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorito" (
    "id" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,

    CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Descuento" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Descuento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalificacionHostUsuario" (
    "id" TEXT NOT NULL,
    "comportamiento" INTEGER NOT NULL,
    "cuidadoVehiculo" INTEGER NOT NULL,
    "puntualidad" INTEGER NOT NULL,
    "comentario" TEXT,
    "reservationId" TEXT NOT NULL,
    "calificadorId" TEXT NOT NULL,
    "calificadoId" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalificacionHostUsuario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_descuentoId_fkey" FOREIGN KEY ("descuentoId") REFERENCES "Descuento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combustible" ADD CONSTRAINT "Combustible_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaracteristicaAdicional" ADD CONSTRAINT "CaracteristicaAdicional_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "Imagen_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "Renter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalificacionHostUsuario" ADD CONSTRAINT "CalificacionHostUsuario_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalificacionHostUsuario" ADD CONSTRAINT "CalificacionHostUsuario_calificadorId_fkey" FOREIGN KEY ("calificadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalificacionHostUsuario" ADD CONSTRAINT "CalificacionHostUsuario_calificadoId_fkey" FOREIGN KEY ("calificadoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
