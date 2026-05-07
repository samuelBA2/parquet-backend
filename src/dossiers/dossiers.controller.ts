import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put} from '@nestjs/common';
import { DossiersService } from './dossiers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { UpdateDossierDto } from './dto/update-dossier.dto';
import { UtilisateurConnecte } from 'src/auth/decorators/utilisateur-connecte.decorator';

@UseGuards(JwtAuthGuard)
@Controller('dossiers')
export class DossiersController {
  constructor(private readonly dossiersService: DossiersService) {}

  @Post()
  create(@Body() dto: CreateDossierDto,@UtilisateurConnecte() user : any) {
    return this.dossiersService.create(dto, user);
  }

  @Put(':id')
  mettreAjour(@Param('id') id: string, @Body() updateDossierDto: UpdateDossierDto, @UtilisateurConnecte() user: any,) {
    return this.dossiersService.mettreAJour(id, updateDossierDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dossiersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDossierDto: UpdateDossierDto) {
    return this.dossiersService.update(+id, updateDossierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dossiersService.remove(+id);
  }
}
