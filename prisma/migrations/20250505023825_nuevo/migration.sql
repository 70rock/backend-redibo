/*
  Warnings:

  - You are about to drop the column `vim` on the `Car` table. All the data in the column will be lost.
  - The `status` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estado` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[renterId,carId]` on the table `Favorito` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EstadoReservacion" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "EstadoReporte" AS ENUM ('PENDIENTE', 'REVISADO', 'RESUELTO', 'RECHAZADO');

-- DropForeignKey
ALTER TABLE "CalificacionHostUsuario" DROP CONSTRAINT "CalificacionHostUsuario_calificadoId_fkey";

-- DropForeignKey
ALTER TABLE "CalificacionHostUsuario" DROP CONSTRAINT "CalificacionHostUsuario_calificadorId_fkey";

-- DropForeignKey
ALTER TABLE "CalificacionHostUsuario" DROP CONSTRAINT "CalificacionHostUsuario_reservationId_fkey";

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_userId_fkey";

-- DropForeignKey
ALTER TABLE "CaracteristicaAdicional" DROP CONSTRAINT "CaracteristicaAdicional_carId_fkey";

-- DropForeignKey
ALTER TABLE "Combustible" DROP CONSTRAINT "Combustible_carId_fkey";

-- DropForeignKey
ALTER TABLE "Favorito" DROP CONSTRAINT "Favorito_carId_fkey";

-- DropForeignKey
ALTER TABLE "Favorito" DROP CONSTRAINT "Favorito_renterId_fkey";

-- DropForeignKey
ALTER TABLE "Imagen" DROP CONSTRAINT "Imagen_carId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_renterId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reporterId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_renterId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_renterId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reservationId_fkey";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "vim",
ADD COLUMN     "vin" TEXT;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "status",
ADD COLUMN     "status" "EstadoReporte" NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoReservacion" NOT NULL DEFAULT 'PENDIENTE';

-- CreateIndex
CREATE INDEX "CalificacionHostUsuario_reservationId_idx" ON "CalificacionHostUsuario"("reservationId");

-- CreateIndex
CREATE INDEX "CalificacionHostUsuario_calificadorId_idx" ON "CalificacionHostUsuario"("calificadorId");

-- CreateIndex
CREATE INDEX "CalificacionHostUsuario_calificadoId_idx" ON "CalificacionHostUsuario"("calificadoId");

-- CreateIndex
CREATE INDEX "Car_userId_idx" ON "Car"("userId");

-- CreateIndex
CREATE INDEX "Car_marca_modelo_idx" ON "Car"("marca", "modelo");

-- CreateIndex
CREATE INDEX "Car_ciudad_provincia_pais_idx" ON "Car"("ciudad", "provincia", "pais");

-- CreateIndex
CREATE INDEX "CaracteristicaAdicional_carId_idx" ON "CaracteristicaAdicional"("carId");

-- CreateIndex
CREATE INDEX "Combustible_carId_idx" ON "Combustible"("carId");

-- CreateIndex
CREATE INDEX "Favorito_renterId_idx" ON "Favorito"("renterId");

-- CreateIndex
CREATE INDEX "Favorito_carId_idx" ON "Favorito"("carId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorito_renterId_carId_key" ON "Favorito"("renterId", "carId");

-- CreateIndex
CREATE INDEX "Imagen_carId_idx" ON "Imagen"("carId");

-- CreateIndex
CREATE INDEX "Renter_email_idx" ON "Renter"("email");

-- CreateIndex
CREATE INDEX "Report_renterId_idx" ON "Report"("renterId");

-- CreateIndex
CREATE INDEX "Report_reporterId_idx" ON "Report"("reporterId");

-- CreateIndex
CREATE INDEX "Reservation_renterId_idx" ON "Reservation"("renterId");

-- CreateIndex
CREATE INDEX "Reservation_hostId_idx" ON "Reservation"("hostId");

-- CreateIndex
CREATE INDEX "Reservation_carId_idx" ON "Reservation"("carId");

-- CreateIndex
CREATE INDEX "Reservation_fechaInicio_fechaFin_idx" ON "Reservation"("fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "Review_renterId_idx" ON "Review"("renterId");

-- CreateIndex
CREATE INDEX "Review_hostId_idx" ON "Review"("hostId");

-- CreateIndex
CREATE INDEX "Review_reservationId_idx" ON "Review"("reservationId");

-- CreateIndex
CREATE INDEX "Review_carId_idx" ON "Review"("carId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_googleId_idx" ON "User"("googleId");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "Renter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "Renter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "Renter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combustible" ADD CONSTRAINT "Combustible_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaracteristicaAdicional" ADD CONSTRAINT "CaracteristicaAdicional_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "Imagen_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "Renter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalificacionHostUsuario" ADD CONSTRAINT "CalificacionHostUsuario_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalificacionHostUsuario" ADD CONSTRAINT "CalificacionHostUsuario_calificadorId_fkey" FOREIGN KEY ("calificadorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalificacionHostUsuario" ADD CONSTRAINT "CalificacionHostUsuario_calificadoId_fkey" FOREIGN KEY ("calificadoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
