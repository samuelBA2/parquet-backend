import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';


// Définition d'un objet de sélection pour les champs à retourner lors des requêtes utilisateur
const userSlect = {
    id: true,
    firstname: true, 
    lastname: true,
    matricule: true,
    role: true,
}

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}
        async getAllusers(){ //methode pour récupérer les informations de tous les utilisateurs de la base de données
            const users = await this.prisma.user.findMany({
                select:  userSlect,
            });
            return users;

        }
    
         async getUser(userId: string){ //methode pour récupérer les informations d'un utilisateur spécifique en fonction de son ID
            const users = await this.prisma.user.findUnique({
                where: {id: userId},
                select: userSlect,
            });
            return users;
        }
        // Méthode pour mettre à jour les informations d'un utilisateur
        async updateUser(id: string, data: any) { const {firstname, lastname, password } = data;
        const updateData: any = {};

        if (firstname) { // Vérifier si le prénom est fourni dans les données de mise à jour et l'ajouter à l'objet updateData
            updateData.firstname = firstname;
        }
        if (lastname) { // Vérifier si le nom de famille est fourni dans les données de mise à jour et l'ajouter à l'objet updateData
            updateData.lastname = lastname;
        }
        if (password) {   // Vérifier si le mot de passe est fourni dans les données de mise à jour
            const salt = await bcrypt.genSalt(10);//un sel est généré pour renforcer la sécurité du mot de passe haché. 
            updateData.password = await bcrypt.hash(data.password, salt);//hachage mdp avec le sel
        }
       return await this.prisma.user.update({ //mise à jour de l'utilisateur dans la base de données en utilisant Prisma
        where: { id },
        data: updateData,
        select: userSlect, //sélectionner les champs à retourner après la mise à jour de l'utilisateur,
    });
    }
        async softDeleteUser(id: string) { // Méthode pour supprimer un utilisateur de la base de données en fonction de son ID
            return await this.prisma.user.update({
                where: { id },
                data: { isActive: false }, // Marquer l'utilisateur comme inactif au lieu de le supprimer physiquement de la base de données
                select: userSlect, //sélectionner les champs à retourner après la suppression de l'utilisateur,
            });
        }
        async softRestoreUser(id: string){ // Méthode pour resteaurer un utilisateur de la base de données en fonction de son ID
            return await this.prisma.user.update({
                where: {id},
                data:{isActive: true},
                select: userSlect,
            })
        }
}
