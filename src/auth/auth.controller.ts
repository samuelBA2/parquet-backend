import { Body, Controller, Post, Get, UseGuards, Request, ExecutionContext, Injectable, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport'; 

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
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
@Get('profile')
@UseGuards(AuthGuard('jwt'))
getProfile(@Request() req) {
  return this.authService.getProfile (req.user.userId);
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
