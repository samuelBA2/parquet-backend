export class RegisterDto {
    firstname: string;
    lastname: string;
    password: string;
    matricule : string;
    role: 'PROCUREUR' | 'MAGISTRAT' | 'GREFFIER' | 'ADMIN';
}
