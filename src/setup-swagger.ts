import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle("BOOK API")
    .setDescription("")
    .addBearerAuth(  {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    );

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }


  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup("documentation", app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  console.info(
    `Documentation: http://localhost:${process.env.PORT}/documentation`
  );
}