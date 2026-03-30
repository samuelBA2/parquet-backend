import { Body, Controller, Post, Get, UseGuards, Request, ExecutionContext, Injectable, Param, Res } from '@nestjs/common';
import type { Response as ExpressResponse, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport'; 
import type { Response } from 'express';

@Injectable()
export class DebugJwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    console.log('err:', err);
    console.log('user:', user);
    console.log('info:', info);
    return super.handleRequest(err, user, info, context, status);
  }
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }


  @Post('login')
  async login(@Body() body:any, @Res({ passthrough: true }) res: Response){
    const authData = await this.authService.login(body);

    // Stockage des tokens dans des cookies sécurisés
    res.cookie('access_token', authData.token, {
      httpOnly: true, // Empêche l'accès au cookie via JavaScript
      secure: false, // Utilise le cookie sécurisé en production
      sameSite: 'lax', // Empêche les requêtes cross-site non sécurisées
    })
  }
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req: any, @Res({ passthrough : true}) res: ExpressResponse) {
    // 1. ACTION SERVEUR : On invalide le Refresh Token en base de données
  // Cela empêche toute reconnexion automatique avec ce compte

  await this.authService.logout(req.user.userId);

    // 2. ACTION CLIENT : On nettoie le navigateur 
    res.clearCookie('access_token'); // Supprimez le cookie contenant le token d'accès
    res.clearCookie('refresh_token'); // Supprimez le cookie contenant le token de rafraîchissement
    return({ message: 'Déconnexion réussie' });
  }
@Get('profile')
@UseGuards(AuthGuard('jwt'))
getProfile(@Request() req) {
  return this.authService.getProfile(req.user.userId);
}
@Get('user')
@UseGuards(DebugJwtGuard) // Utilisez votre garde personnalisée pour le débogage
getUser(@Request() req) {
  console.log('Requête reçue dans getUser:', req.user);
  return req.user;  
}
@Get(( '/:userId'))
getUserById(@Param('userId') userId: string) {
  return this.authService.getProfile (userId);

}
}
