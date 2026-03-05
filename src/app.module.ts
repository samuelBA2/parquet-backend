import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), // Charge les variables d'environnement depuis le fichier .env
    PrismaModule,
    AuthModule,
    JwtModule.register({
      secret: 'JO123', // Utilisez une variable d'environnement pour plus de sécurité
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}