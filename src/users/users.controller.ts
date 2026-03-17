import { Controller, Param, Patch, Delete,Body, Request, ForbiddenException} from '@nestjs/common';
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
    // users.controller.ts
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {

        const isSelf = req.user.userId === id; // Vérifier si l'utilisateur essaie de supprimer son propre compte

        const isProcureur = req.user.role === 'PROCUREUR'; // Vérifier si l'utilisateur a le rôle de procureur


    // Vérification : l'utilisateur doit être soit le propriétaire du compte, soit un procureur pour pouvoir supprimer le compte

    if (!isSelf && !isProcureur) { // Si l'utilisateur n'est pas le propriétaire du compte et n'est pas un procureur, on lui refuse l'accès à la suppression du compte
        throw new ForbiddenException("Vous n'avez pas le droit de supprimer ce compte.");
    }
    await this.usersService.softDeleteUser(id); // Appeler la méthode de soft-delete du service pour désactiver le compte de l'utilisateur
        return {
        message: isSelf ?"Votre compte a été désactivé avec succès. Vos données judiciaires sont conservées conformément à la loi." 
        : "Le Procureur a désactivé ce compte avec succès. Les données judiciaires associées sont conservées conformément à la loi.",
    };
        }
    
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/reactivate')// URL du type /users/id-du-magistrat/reactivate
    async reactivate(@Param('id') id: string, @Request() req: any){
        // SÉCURITÉ!! seul le procureur a le droit de réactiver un compte 
        if(req.user.role !== 'PROCUREUR'){
            throw new ForbiddenException('Seul le Procureur peut réactiver un compte désactivé.')

        }

        const user = await this.usersService.softRestoreUser(id);

        return {
            message : `Le compte du ${user.role} ${user.firstname} ${user.lastname} a été reactivé avec succès.`, 
        };
    }
}
