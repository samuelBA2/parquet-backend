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

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    //création d'un nouvel utilisateur dans la base de données avec les informations fournies et le mot de passe haché
    
    const newUser = await this.prisma.user.create({
        data: {
        matricule: data.matricule,
        firstname: data.firstname,
        lastname: data.lastname,
        password: hashedPassword,
        role: data.role,
    },
    });
    const token = await this.jwtService.signAsync({
      userId: newUser.id,
      role: newUser.role,
    });

    
    return { user : newUser, token };
  }

  //LOGIN//

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
        lastname: user.lastname,
        firstname: user.firstname,
     });

    return { token };
}
  

async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            matricule: true,
            role: true,
        },
    });
    return user;
}
}
