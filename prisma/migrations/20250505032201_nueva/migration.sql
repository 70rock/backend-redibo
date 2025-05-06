-- DropForeignKey
ALTER TABLE "CalificacionHostUsuario" DROP CONSTRAINT "CalificacionHostUsuario_calificadoId_fkey";

-- DropForeignKey
ALTER TABLE "CalificacionHostUsuario" DROP CONSTRAINT "CalificacionHostUsuario_calificadorId_fkey";

-- AddForeignKey
ALTER TABLE "CalificacionHostUsuario" ADD CONSTRAINT "CalificacionHostUsuario_calificadorId_fkey" FOREIGN KEY ("calificadorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalificacionHostUsuario" ADD CONSTRAINT "CalificacionHostUsuario_calificadoId_fkey" FOREIGN KEY ("calificadoId") REFERENCES "Renter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
