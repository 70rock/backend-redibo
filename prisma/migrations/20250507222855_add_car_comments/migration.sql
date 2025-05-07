/*
  Warnings:

  - The values [REVISADO,RECHAZADO] on the enum `EstadoReporte` will be removed. If these variants are still used in the database, this will fail.
  - The `estado` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[placa]` on the table `Car` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Made the column `año` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `placa` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `precioPorDia` on table `Car` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('DISPONIBLE', 'RESERVADO', 'MANTENIMIENTO');

-- AlterEnum
BEGIN;
CREATE TYPE "EstadoReporte_new" AS ENUM ('PENDIENTE', 'EN_REVISION', 'RESUELTO', 'DESCARTADO');
ALTER TABLE "Report" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Report" ALTER COLUMN "status" TYPE "EstadoReporte_new" USING ("status"::text::"EstadoReporte_new");
ALTER TYPE "EstadoReporte" RENAME TO "EstadoReporte_old";
ALTER TYPE "EstadoReporte_new" RENAME TO "EstadoReporte";
DROP TYPE "EstadoReporte_old";
ALTER TABLE "Report" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE';
COMMIT;

-- AlterEnum
ALTER TYPE "EstadoReservacion" ADD VALUE 'EN_CURSO';

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "color" TEXT NOT NULL,
ALTER COLUMN "año" SET NOT NULL,
ALTER COLUMN "placa" SET NOT NULL,
ALTER COLUMN "precioPorDia" SET NOT NULL,
DROP COLUMN "estado",
ADD COLUMN     "estado" "CarStatus" NOT NULL DEFAULT 'DISPONIBLE';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'RENTER';

-- CreateTable
CREATE TABLE "CarComment" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarComment_carId_idx" ON "CarComment"("carId");

-- CreateIndex
CREATE INDEX "CarComment_renterId_idx" ON "CarComment"("renterId");

-- CreateIndex
CREATE UNIQUE INDEX "Car_placa_key" ON "Car"("placa");

-- AddForeignKey
ALTER TABLE "CarComment" ADD CONSTRAINT "CarComment_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarComment" ADD CONSTRAINT "CarComment_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "Renter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
