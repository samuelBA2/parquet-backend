import { Module } from '@nestjs/common';
import { ParquetsService } from './parquets.service';
import { ParquetsController } from './parquets.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParquetsController],
  providers: [ParquetsService],
})
export class ParquetsModule {}
