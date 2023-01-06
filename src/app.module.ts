import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // APP Env
        NODE_ENV: Joi.string().required(),
        BASE_URL: Joi.string().required(),
        PORT: Joi.number().required(),

        // DataBase Env
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.boolean().required().default(false),
        DB_LOGGING: Joi.boolean().required(),
        DB_MIGRATION_RUN: Joi.boolean().required(),

        //JWT Env
        JWT_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        EMAIL_TOKEN_SECRET: Joi.string().required(),
        TIME_TOKEN: Joi.string().required(),
        TIME_TOKEN_REFRESH: Joi.number().required(),
        TYPE_TIME_TOKEN_REFRES: Joi.string().required(),
        TIME_TOKEN_EMAIL: Joi.string().required(),

        // Email Server Env
        USER_SERVER_EMAIL: Joi.string().required(),
        PASS_SERVER_EMAIL: Joi.string().required(),
        HOST_SERVER_EMAIL: Joi.string().required(),
        PORT_SERVER_EMAIL: Joi.number().required(),
        SECURE_SERVER_EMAIL: Joi.boolean().required(),
        EMAIL: Joi.string().required(),
      }),
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    MailModule,
    CommonModule,
    SeedModule,
    FilesModule,
  ],
  controllers: [],
})
export class AppModule {}
