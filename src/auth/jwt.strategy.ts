import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { 
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.access_token; // Extraction du token JWT à partir des cookies de la requête
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'JO123',
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
