import { IsNotEmpty, IsString, IsEnum, IsInt, MinLength } from 'class-validator';

export class LoginDto {

    @IsString()
    @IsNotEmpty()
    matricule: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
    password: string;
}   