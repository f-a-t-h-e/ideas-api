import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  // ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './shared/validation/validation.pipe'; // castom validation
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
const port = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:4200', // angular
      // 'http://localhost:3000', // react
      // 'http://localhost:8081', // react-native
    ],
    credentials: true, // You forgot you need cookies on the frontend aswell -_-!
  });
  app.use(cookieParser());

  // Add swegger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Idea Open Api')
    .setDescription('Idea Open Api Document')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(port);
  Logger.log(`Server is up and running`, 'Bootstrap');
}
bootstrap();
