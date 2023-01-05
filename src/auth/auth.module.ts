import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { CommonModule } from '../common/common.module';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        // useFactory: (configService: ConfigService) => {
        return {
          // secret: configService.get('JWT_SECRET'),
          // signOptions: {
          //   expiresIn: '2h',
          // },
        };
      },
    }),
    forwardRef(() => UsersModule),
    MailModule,
    CommonModule,
  ],
  exports: [JwtStrategy, PassportModule, JwtModule, AuthService, ConfigModule],
})
export class AuthModule {}
