import { Injectable } from '@nestjs/common';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { UpdateDossierDto } from './dto/update-dossier.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatutDossier } from '@prisma/client';
import { NumeroDossierService } from './numero-dossier.service';
import { ForbiddenException,BadRequestException } from '@nestjs/common';

@Injectable()
export class DossiersService {

  //injection prisma
  constructor(
      private prisma: PrismaService,
      private numeroService: NumeroDossierService
  ){}

    async create(dto:CreateDossierDto, user: { id: string ; parquetId: number ; nomParquet: string}) {
      const annee = new Date().getFullYear();
      const registreId = Number(dto.registreId);

      //compteur 
      const numeroOrdre = await this.numeroService.prochainNumeroOrdre(registreId, annee);

      //abreviation du registre 
      const registre = await this.prisma.registre.findUniqueOrThrow({
        where: { id: registreId},
      });
      //Numero construit avec nomParquet issu du token, abreviation du registre et numero d'ordre

      const numeroDossier = this.numeroService.formaterNumero(
        registre.abreviation,
        numeroOrdre,
        annee,
        user.nomParquet,
      );
    return this.prisma.dossier.create({
      data: {
        numeroDossier,
        numeroOrdre,
        annee,
        nomPrevenu: dto.nomPrevenu ?? '',
        nomVictime: dto.nomVictime ?? '',
        infraction: dto.infraction ?? '',
        statut:     dto.statut ?? StatutDossier.EN_ATTENTE,
        nomDossier: dto.nomDossier,
        etape:      dto.etape,
        description:dto.description ?? '',
        createdBy:  dto.createdBy,
        dateFaits:  new Date(dto.dateFaits),
        registreId: dto.registreId ? 
        registreId: Number(dto.registreId),
        authorId:   user.id,
        parquetId:  user.parquetId,},
    });
  }

//methode pour trouver un dossier par date
  async research() {

    return `This action returns all dossiers`;
  }
  async mettreAJour(id: string, dto: UpdateDossierDto, user: { id: string ; parquetId: number }) {
    const dossier = await this.prisma.dossier.findUniqueOrThrow({
      where: { id },
    });

    const allowed = (dossier.parquetId !== null && dossier.parquetId === user.parquetId) || dossier.authorId === user.id;

  if (!allowed) {
    throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier ce dossier');
  }

  const dataToUpdate: any = {dto};
  if(dto.dateFaits){
    dataToUpdate.dateFaits = new Date(dto.dateFaits);
  }
  if(dto.registreId !== undefined){
    dataToUpdate.registreId = Number(dto.registreId);
  }

  return this.prisma.dossier.update({
    where: { id },
    data: dataToUpdate,
  });

  }
  findOne(id: number) {
    return `This action returns a #${id} dossier`;
  }

  update(id: number, updateDossierDto: UpdateDossierDto) {
    return `This action updates a #${id} dossier`;
  }

  remove(id: number) {
    return `This action removes a #${id} dossier`;
  }
}
