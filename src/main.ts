import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());


  //secure l'API en utilisant des en-têtes de sécurité HTTP
app.enableCors({
  //origine : Autorise uniquement ton interface à accéder à l'API
  Credential: true, // Permet l'envoi de cookies et d'informations d'identification dans les requêtes cross-origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
});

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

