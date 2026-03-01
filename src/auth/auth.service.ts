import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
        where: {matricule: data.matricule},});

        if(existingUser) {
            throw new BadRequestException('Le numero de matricule est déjà utilisé');
        }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        matricule: data.matricule,
        password: hashedPassword,
        role: data.role,
      },
    });

    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    return { token };
  }
    async login(data: LoginDto) {
    // Chercher l'utilisateur par son matricule
    const user = await this.prisma.user.findUnique({
      where: { matricule: data.matricule },
    });
    // Si l'utilisateur n'existe pas, ou si le mot de passe est incorrect, on retourne une erreur
    if (!user){
        throw new BadRequestException('Matricule ou mot de passe incorrect');
    }
    // comparer le mot de passe fourni avec le mot de passe haché stocké dans la base de données
    const passwordValid = await bcrypt.compare(data.password, user.password);

     // Si l'utilisateur n'existe pas, ou si le mot de passe est incorrect, on retourne une erreur
     if(!passwordValid){
        throw new BadRequestException('Matricule ou mot de passe incorrect');
     }
     // Si les informations d'identification sont valides, on génère un token JWT
     const token = this.jwtService.sign({
        userId: user.id,
        role: user.role,
     });

     return { token };
}
  
}
