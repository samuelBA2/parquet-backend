-- CreateTable
CREATE TABLE "Dossier" (
    "id" TEXT NOT NULL,
    "numeroDossier" TEXT NOT NULL,
    "nomDemandeur" TEXT NOT NULL,
    "nomDefendeur" TEXT NOT NULL,
    "infraction" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateFaits" TIMESTAMP(3) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Dossier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dossier_numeroDossier_key" ON "Dossier"("numeroDossier");

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
