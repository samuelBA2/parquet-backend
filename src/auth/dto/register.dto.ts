import { IsNotEmpty, IsString, IsEnum, IsInt, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
    @IsString()
    firstname: string;

    @IsString()
    lastname: string;

    @IsString()
    @IsNotEmpty()

    @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
    password: string;

    @IsString()
    @IsNotEmpty()
    matricule : string;

    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    parquetId: number;

    @IsEnum(['PROCUREUR', 'MAGISTRAT', 'GREFFIER', 'ADMIN'])
    role: 'PROCUREUR' | 'MAGISTRAT' | 'GREFFIER' | 'ADMIN';
}
