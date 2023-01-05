import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { userData } from '../auth/interfaces';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserConfirmation(email: string, token: string) {
    const url = `${this.configService.get(
      'BASE_URL',
    )}/verify/account/?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenido! a API NESTJS',
      html: `<div
      style="background-color: #f5f3f2; border-radius: 5px; text-align: center">
      <br />
      <img src = "./img/logo.svg" alt="logo" width="350px"/>
      <h2>Necesitas Verificar tu cuenta</h2>
        <p
          style="
            background-color: #a64a4a;
            color: white;
            font-size: 18px;
            width: 250px;
            text-align: center;
            display: inline-block;
            border-radius: 5px">
          Hola ${email}
        </p>
        <p>
        Para confirmar tu cuenta debes hacer click en el siguiente enlace
      </p>
      <a href="${url}">
        <button
        style="
        background-color: #a64a4a;
        color: white;
        font-size: 18px;
        width: 250px;
        height: 40px;
        border-radius: 8px">
          Confirmar cuenta
        </button>
      </a>
      <br />
        <p>
          Este correo tiene una validez de 15 minutos
        </p>
        <br />
    </div>`,
      //   template: './confirmation', // `.hbs` extension is appended automatically
      //   context: {
      //     // ✏️ filling curly brackets with content
      //     email: user.email,
      //     url,
      //   },
    });
  }

  async sendEmailResetPassword(user: userData, token: string) {
    const url = `${this.configService.get(
      'BASE_URL',
    )}/change/password/?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset Password',
      html: ` <div
      style="background-color: #f5f3f2; border-radius: 5px; text-align: center">
      <br />
      <img src = "./img/logo.svg" alt="logo" width="350px"/>
      <h2>Solicitud de cambio de contraseña</h2>
        <p
          style="
            background-color: #a64a4a;
            color: white;
            font-size: 18px;
            width: 250px;
            text-align: center;
            display: inline-block;
            border-radius: 5px">
          ${user.email}
        </p>
        <p>
        Para cambiar tu contraseña debes hacer click en el siguiente enlace
      </p>
      <a href="${url}">
        <button
          style="
            background-color: #a64a4a;
            color: white;
            font-size: 18px;
            width: 250px;
            height: 40px;
            border-radius: 8px">
          Cambiar Contraseña
        </button>
      </a>
      <br />
        <p>
          ¿No has solicitado este cambio? <br />
          Omite este correo y tu contraseña seguirá siendo la misma.
        </p>
        <p>
          Este correo tiene una validez de 15 minutos
        </p>
        <br />
    </div>`,
    });
  }
}
