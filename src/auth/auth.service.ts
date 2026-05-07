import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

const userSlect = {
    id: true,
    firstname: true,
    lastname: true,
    matricule: true,
    role: true,
}
// Cette classe définit les méthodes d'authentification pour l'application, 
// y compris l'enregistrement, la connexion, la déconnexion et la récupération du profil utilisateur. 
// Elle utilise Prisma pour interagir avec la base de données et bcrypt pour le hachage des mots de passe. 
// Le service génère également des tokens JWT pour l'authentification des utilisateurs.
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
) {}


  // auth.service.ts
    async signerToken(userId: number, role: string) {
        const payload = { sub: userId, role };
        
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
    async register(data: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
        where: {matricule: data.matricule},});

        if(existingUser)throw new ConflictException('Le numero de matricule est déjà utilisé');
        
        
    await this.prisma.parquet.findUniqueOrThrow({
        where: { id: data.parquetId },
    });


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
        parquetId: data.parquetId,
    },

    include: { parquet: true },
    });
    if (!newUser.parquet) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
    }
        const token = await this.getTokens(
            newUser.id,
            newUser.role,
            newUser.lastname,
            newUser.firstname,
            newUser.parquetId,
            newUser.parquet.nom,

        );
    await this.updateRefreshToken(newUser.id, token.refresh_token);
    
    return { user : newUser, token };
    }

  //LOGIN//

    async login(data: LoginDto) {
    // Chercher l'utilisateur par son matricule
    const user = await this.prisma.user.findUnique({
    where: { matricule: data.matricule },
    include: { parquet: true },
    });
    // Si l'utilisateur n'existe pas, ou si le mot de passe est incorrect, on retourne une erreur
    if (!user || !(await bcrypt.compare(data.password, user.password))){
        throw new UnauthorizedException('Matricule ou mot de passe incorrect');
    
    }

    if (!user.isActive) { // Vérifier si l'utilisateur existe et est actif
        throw new UnauthorizedException('Identifiants incorrects ou compte désactivé.');
    }
    // comparer le mot de passe fourni avec le mot de passe haché stocké dans la base de données
    const passwordValid = await bcrypt.compare(data.password, user.password);

     // Si l'utilisateur n'existe pas, ou si le mot de passe est incorrect, on retourne une erreur
    if(!passwordValid){
        throw new UnauthorizedException('Matricule ou mot de passe incorrect');
    }
     // Si les informations d'identification sont valides, on génère un token JWT
    const token = await this.getTokens(
        user.id,
        user.role,
        user.lastname,
        user.firstname,
        user.parquetId,
        user.parquet?.nom?? 'PARQUET INCONNU',
    );

    
    await this.updateRefreshToken(user.id, token.refresh_token); // Stocker le refresh token haché dans la base de données pour l'utilisateur

    return { access_token: token.access_token, 
            refresh_token: token.refresh_token };
}
    
    //Fonction utilitaire pour generer les jetons 
    async getTokens(userId: string, role: string, lastname: string, firstname: string, parquetId: number, nomParquet: string) {
        const payload = { sub: userId, role, lastname, firstname, nomParquet,  parquetId };

        const [at,rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            }),
        ]);
        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    //fonction pour hasher et sauvegarder le refresh token dans la base de données
    async updateRefreshToken(userId: string, refreshToken : string) {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken: hashedToken },
        });
    }
//LOGOUT//

async logout(userId: string) {
  // Supprimer le token de rafraîchissement haché de la base de données pour l'utilisateur
  await this.prisma.user.update({
    where: { id: userId },
    data: { hashedRefreshToken: null },
  });
  return { message: 'Déconnexion réussie' };
}

async getProfile(userId: string) { //methode pour récupérer les informations d'un utilisateur spécifique en fonction de son ID
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
        select: userSlect,
    });
    return user;
}


}
