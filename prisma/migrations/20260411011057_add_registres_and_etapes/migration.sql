/*
  Warnings:

  - You are about to drop the column `nomDefendeur` on the `Dossier` table. All the data in the column will be lost.
  - You are about to drop the column `nomDemandeur` on the `Dossier` table. All the data in the column will be lost.
  - Added the required column `nomPrevenu` to the `Dossier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomVictime` to the `Dossier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registreId` to the `Dossier` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EtapeDossier" AS ENUM ('ENQUETE_PRELIMINAIRE', 'INSTRUCTION', 'AUDIENCE', 'JUGEMENT_RENDU', 'ARCHIVE');

-- AlterTable
ALTER TABLE "Dossier" DROP COLUMN "nomDefendeur",
DROP COLUMN "nomDemandeur",
ADD COLUMN     "etape" "EtapeDossier" NOT NULL DEFAULT 'ENQUETE_PRELIMINAIRE',
ADD COLUMN     "nomPrevenu" TEXT NOT NULL,
ADD COLUMN     "nomVictime" TEXT NOT NULL,
ADD COLUMN     "registreId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Registre" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Registre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Registre_nom_key" ON "Registre"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Registre_code_key" ON "Registre"("code");

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_registreId_fkey" FOREIGN KEY ("registreId") REFERENCES "Registre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
