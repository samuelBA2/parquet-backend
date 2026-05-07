/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Dossier` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Dossier` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Dossier` table. All the data in the column will be lost.
  - The `statut` column on the `Dossier` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Registre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Registre` table. All the data in the column will be lost.
  - The `id` column on the `Registre` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `annee` to the `Dossier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroOrdre` to the `Dossier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parquetId` to the `Dossier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedOn` to the `Dossier` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `registreId` on the `Dossier` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `parquetId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatutDossier" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'CLOTURE', 'SANS_SUITE', 'URGENT');

-- DropForeignKey
ALTER TABLE "Dossier" DROP CONSTRAINT "Dossier_registreId_fkey";

-- DropIndex
DROP INDEX "Registre_code_key";

-- AlterTable
ALTER TABLE "Dossier" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "annee" INTEGER NOT NULL,
ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedOn" TIMESTAMP(3),
ADD COLUMN     "numeroOrdre" INTEGER NOT NULL,
ADD COLUMN     "parquetId" INTEGER NOT NULL,
ADD COLUMN     "updatedOn" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "infraction" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
DROP COLUMN "statut",
ADD COLUMN     "statut" "StatutDossier" NOT NULL DEFAULT 'EN_ATTENTE',
ALTER COLUMN "nomPrevenu" DROP NOT NULL,
ALTER COLUMN "nomVictime" DROP NOT NULL,
DROP COLUMN "registreId",
ADD COLUMN     "registreId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Registre" DROP CONSTRAINT "Registre_pkey",
DROP COLUMN "code",
ADD COLUMN     "abreviation" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Registre_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "parquetId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "parquet" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "parquet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompteurOrdre" (
    "id" SERIAL NOT NULL,
    "registreId" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "dernierOrdre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CompteurOrdre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parquet_nom_key" ON "parquet"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "CompteurOrdre_registreId_annee_key" ON "CompteurOrdre"("registreId", "annee");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parquetId_fkey" FOREIGN KEY ("parquetId") REFERENCES "parquet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompteurOrdre" ADD CONSTRAINT "CompteurOrdre_registreId_fkey" FOREIGN KEY ("registreId") REFERENCES "Registre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_registreId_fkey" FOREIGN KEY ("registreId") REFERENCES "Registre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_parquetId_fkey" FOREIGN KEY ("parquetId") REFERENCES "parquet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
