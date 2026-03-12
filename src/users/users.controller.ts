import { Controller, Param, Patch, Body, Request, ForbiddenException} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Get, UseGuards } from '@nestjs/common';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @Get()
    @UseGuards(AuthGuard('jwt')) // Assurez-vous que seuls les utilisateurs authentifiés peuvent accéder à cette route
    findAll() {
        return this.usersService.getAllusers();
    }
    @Get('/:id')
    getUser(@Param('id') userId: string) {
        return this.usersService.getUser(userId);
    }

    @UseGuards(AuthGuard('jwt')) // Assurez-vous que seuls les utilisateurs authentifiés peuvent accéder à cette route
    @Patch(':id')
    async update(
        @Param('id') userId: string,
        @Body() updateUserDto: { firstname?: string; lastname?: string; password?: string },
        @Request() req: any ) // Récupérer les informations de l'utilisateur authentifié à partir de la requête    
    { if (req.user.userId !== userId) { // Vérifier que l'utilisateur authentifié correspond à l'utilisateur à mettre à jour
        throw new ForbiddenException ('vous n\'êtes pas autorisé à mettre à jour les informations de cet utilisateur');
    }
        // Appeler le service pour mettre à jour les informations de l'utilisateur
        return await this.usersService.updateUser(userId, updateUserDto);
    }
}