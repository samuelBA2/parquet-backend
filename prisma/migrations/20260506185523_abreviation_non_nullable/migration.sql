/*
  Warnings:

  - Made the column `abreviation` on table `Registre` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Registre" ALTER COLUMN "abreviation" SET NOT NULL;
