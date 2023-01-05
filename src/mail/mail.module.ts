import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('HOST_SERVER_EMAIL'),
          secure: !!configService.get('SECURE_SERVER_EMAIL') === true, // change a true for gmail server
          port: configService.get('PORT_SERVER_EMAIL'),
          auth: {
            user: configService.get('USER_SERVER_EMAIL'),
            pass: configService.get('PASS_SERVER_EMAIL'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get('EMAIL')}>`,
        },
        // template: {
        //   dir: join(__dirname, 'templates'),
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService, MailerModule],
})
export class MailModule {}
