import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);
  // Enable CORS for the frontend URL (from environment variable)
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }); 

  // Configure Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Club Membership API')
    .setDescription('API documentation for Club Membership backend')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // This is the key we'll use in @ApiBearerAuth() decorator
    )
    .build();
  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);
  // Serve Swagger UI at /docs
  SwaggerModule.setup('docs', app, document);

  // Start the server on the specified port (default 3001)
  await app.listen(process.env.PORT ?? 3001);
}
// Bootstrap the application
bootstrap();
