/*
  Warnings:

  - You are about to drop the column `Prenom` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Prenom",
DROP COLUMN "nom",
ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL;
