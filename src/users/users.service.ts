import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}
        async getAllusers(){
            const users = await this.prisma.user.findMany({
                select: {
                    id: true,
                    matricule: true,
                    firstname: true,
                    lastname: true,
                    role: true,
                },
            });
            return users;

        }
    
     async getUser(userId: string){
            const users = await this.prisma.user.findUnique({
                where: {id: userId},
                select: {
                    id: true,
                    matricule: true,
                    firstname: true,
                    lastname: true,
                    role: true,
                },
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
                    const salt = await bcrypt.genSalt(10);//générer un sel pour le hachage du mdp
                    updateData.password = await bcrypt.hash(data.password, salt);//hachage mdp avec le sel
        }
       return await this.prisma.user.update({ //mise à jour de l'utilisateur dans la base de données en utilisant Prisma
        where: { id },
        data: updateData,
        select: { //sélectionner les champs à retourner après la mise à jour de l'utilisateur
            id: true,
            firstname: true, 
            lastname: true,
            matricule: true,
            role: true,
        },
    });
    }
}
