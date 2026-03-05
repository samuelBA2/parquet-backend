import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthController } from 'src/auth/auth.controller';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}