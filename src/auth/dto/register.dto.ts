export class RegisterDto {
    email: string;
    password: string;
    role: 'PROCUREUR' | 'MAGISTRAT' | 'GREFFIER' | 'ADMIN';
}