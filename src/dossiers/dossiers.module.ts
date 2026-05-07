import { Module } from '@nestjs/common';
import { DossiersService } from './dossiers.service';
import { DossiersController } from './dossiers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { NumeroDossierService } from './numero-dossier.service';

@Module({
  controllers: [DossiersController],
  providers: [DossiersService,NumeroDossierService ,PrismaService ],

})
export class DossiersModule {}
