/*
  Warnings:

  - A unique constraint covering the columns `[nomDossier]` on the table `Dossier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nomDossier` to the `Dossier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dossier" ADD COLUMN     "nomDossier" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "typeDocument" TEXT NOT NULL,
    "cheminFichier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dossierId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dossier_nomDossier_key" ON "Dossier"("nomDossier");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "Dossier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
