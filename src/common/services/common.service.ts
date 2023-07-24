import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../auth/interfaces';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { refreshToken } from 'src/users/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {
  constructor(
    private readonly _jwtService: JwtService,
    @InjectRepository(refreshToken)
    private readonly _refreshTokenRepository: Repository<refreshToken>,
  ) {}

  async comparePassword(
    password: string,
    userPassword: string,
    message = `password doesn't match`,
  ) {
    if (!bcrypt.compareSync(password, userPassword))
      throw new BadRequestException(message);
  }

  async createJwtToken(
    payload: JwtPayload,
    timeExpired: string,
    secretKey: string,
  ) {
    const token = this._jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: timeExpired,
    });
    return token;
  }

  async ValidToken(token: string, secretKey: string) {
    try {
      const verifyToken = this._jwtService.verify(token, {
        secret: secretKey,
      });
      return verifyToken;
    } catch (error) {
      throw new BadRequestException('Token invalid');
    }
  }

  async desactiveToken(token: string) {
    const findToken = await this._refreshTokenRepository.findOne({
      where: { refreshToken: token, active: true },
    });

    if (!findToken) {
      throw new BadRequestException('Token expired, please try again');
    }

    const desactiveToken = await this._refreshTokenRepository.preload({
      id: findToken.id,
      active: false,
    });

    await this._refreshTokenRepository.save(desactiveToken);
  }
}
