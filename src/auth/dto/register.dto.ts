export class RegisterDto {
    password: string;
    matricule : string;
    role: 'PROCUREUR' | 'MAGISTRAT' | 'GREFFIER' | 'ADMIN';
}
