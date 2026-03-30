import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //secure l'API en utilisant des en-têtes de sécurité HTTP
app.enableCors({
  //origine : Autorise uniquement ton interface à accéder à l'API
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
});

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

