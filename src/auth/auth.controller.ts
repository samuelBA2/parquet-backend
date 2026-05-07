import { Body, Controller, Post, Get, UseGuards, Request, ExecutionContext, Injectable, Param, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport'; 

@Injectable()
export class DebugJwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {// Cette méthode est appelée après que le token JWT a été vérifié.
    console.log('err:', err);// Affiche les erreurs éventuelles lors de la validation du token
    console.log('user:', user);// Affiche les informations de l'utilisateur extraites du token JWT
    console.log('info:', info);// Affiche les informations supplémentaires fournies par la stratégie d'authentification, telles que les messages d'erreur ou les détails de l'authentification
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
  async login(@Body() body:LoginDto){
    const token = await this.authService.login(body);
      
      return {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      };

  }
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req: any) {
    
  await this.authService.logout(req.user.userId);

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
