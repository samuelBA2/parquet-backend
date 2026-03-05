import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { // Le 'jwt' est important ici
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECTET = 'JO123', // Utilisez une variable d'environnement pour plus de sécurité,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.userId,
      role: payload.role,
      firstname: payload.firstname,
      lastname: payload.lastname,
      };
    }
  }
