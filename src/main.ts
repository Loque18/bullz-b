import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(bodyParser.json({ limit: '50mb' }));

  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(
    ['/swagger-api', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle(process.env.PROJECT_NAME)
    .setDescription(process.env.PROJECT_DESCRIPTION)
    .setVersion(process.env.VERSION)
    .addTag(process.env.TAGS)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
