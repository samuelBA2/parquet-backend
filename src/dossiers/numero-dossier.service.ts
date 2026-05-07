// src/dossiers/numero-dossier.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NumeroDossierService {

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Formate le numéro de dossier
   * Résultat : RP0001/2026/PARQUET DE KINSHASA
   */
  formaterNumero(
    abreviationRegistre: string,
    numeroOrdre: number,
    annee: number,
    nomParquet: string,
  ): string {
    const ordre = String(numeroOrdre).padStart(4, '0'); // 1 → "0001"
    return `${abreviationRegistre}${ordre}/${annee}/${nomParquet.toUpperCase()}`;
  }

  /**
   * Récupère et incrémente le compteur d'ordre
   * pour un registre + année donnés
   */
  async prochainNumeroOrdre(
    registreId: number,
    annee: number,
  ): Promise<number> {
    return await this.prisma.$transaction(async (tx) => {
      const compteur = await tx.compteurOrdre.upsert({
        where: {
          registreId_annee: { registreId, annee },
        },
        update: {
          dernierOrdre: { increment: 1 },
        },
        create: {
            registreId,
            annee,
            dernierOrdre: 1,
        },
      });
      return compteur.dernierOrdre;
    });
  }

  /**
   * Recalcule le numéro d'un dossier existant
   * appelé uniquement à la sauvegarde si ordre ou parquet changent
   */
  async recalculerNumero(
    registreId: number,
    numeroOrdre: number,
    annee: number,
    parquetId: number,
  ): Promise<string> {
    const [registre, parquet] = await Promise.all([
      this.prisma.registre.findUniqueOrThrow({ where: { id: registreId } }),
      this.prisma.parquet.findUniqueOrThrow({ where: { id: parquetId } }),
    ]);

    return this.formaterNumero(
      registre.abreviation,
      numeroOrdre,
      annee,
      parquet.nom,
    );
  }
}