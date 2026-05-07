import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { 
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'JO123',
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      role: payload.role,
      firstname: payload.firstname,
      lastname: payload.lastname,
      parquetId:  payload.parquetId,
      nomParquet: payload.nomParquet,
      };
    }
  }
