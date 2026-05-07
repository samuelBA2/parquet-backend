import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString, IsInt } from 'class-validator';
import { EtapeDossier, StatutDossier } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateDossierDto {
    @IsString()
    @IsNotEmpty()
    nomDossier: string;

    @IsString()
    @IsOptional()
    infraction?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    nomPrevenu?: string;

    @IsString()
    @IsOptional()
    nomVictime?: string;

    @IsEnum(StatutDossier)
    @IsNotEmpty()
    statut?: StatutDossier;

    @IsString()
    @IsNotEmpty()
    createdBy: string;

    @IsDateString()
    @IsNotEmpty()
    dateFaits: string;

    @Type(() => Number)
    @IsNotEmpty()
    registreId: number;

    @IsEnum(StatutDossier)
    @IsOptional()
    etape?: EtapeDossier;
}