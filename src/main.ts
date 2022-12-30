import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('TimeScale Database')
    .setDescription('Consumes data from crypto exchanges using CCXT APIs. Store data on timeScale database. Exposes data from timeScale database')
    .setVersion('1.0')
    .addTag('marketHistory')
    .addTag('exchanges')
    .addTag('symbols')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app)

  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
