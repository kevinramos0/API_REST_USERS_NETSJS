import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../auth/interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommonService {
  constructor(private readonly _jwtService: JwtService) {}

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
}
