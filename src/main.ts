import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/exception-global.filter';

declare const module: any;

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const app = await NestFactory.create(AppModule, {
      abortOnError: false,
    });
    // enable origins cors
    app.enableCors();

    app.setGlobalPrefix('api');

    // Initialize global exception filter
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        // transformOptions: {
        //   enableImplicitConversion: true,
        // },
      }),
    );

    // app.useStaticAssets(join(__dirname, '..', 'public'));

    // app.useGlobalInterceptors(
    //   new ClassSerializerInterceptor(app.get(Reflector)),
    // );
    /** DOCUMENTACION API */
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('API USERS NESTJS')
      .setDescription('MANAGEMENT USERS WITH NESTJS AND SWAGGER')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    /** FIN DOCUMENTACION API */

    await app.listen(process.env.PORT || 3001);
    logger.log(`App running on port ${process.env.PORT}`);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  } catch (error) {
    logger.error(error);
  }
}
bootstrap();
