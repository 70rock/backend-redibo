-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('HOST', 'RENTER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'HOST';
