import { IsNotEmpty, IsString, IsOptional} from 'class-validator';

export class CreateDossierDto {
    @IsString()
    @IsNotEmpty()
    numeroDossier: string;

    @IsString()
    @IsNotEmpty() 
    intituléAffaire: string;

    @IsString()
    @IsOptional()
    infraction: string;

    @IsString()
    @IsOptional()
    description: string;

    


}
