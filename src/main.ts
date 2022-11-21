import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const port = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add swegger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Idea Open Api')
    .setDescription('Idea Open Api Document')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(`Server is up and running`, 'Bootstrap');
}
bootstrap();
