import * as moment from 'moment-timezone';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';

import { UsersService } from '../users/services/users.service';
import { CommonService } from '../common/services/common.service';
import { MailService } from '../mail/mail.service';
import { User, refreshToken } from '../users/entities';
import { LoginUserDto, ResetPasswordDto } from './dto/auth.dto';
import { userData } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(refreshToken)
    private readonly _refreshTokenRepository: Repository<refreshToken>,
    @Inject(forwardRef(() => UsersService))
    private readonly _usersService: UsersService,
    @Inject(CommonService)
    private readonly _commonService: CommonService,
    private readonly _mailService: MailService,
    private readonly _configService: ConfigService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this._userRepository.findOne({
      where: { email },
      relations: { profile: true },
      select: {
        email: true,
        id: true,
        password: true,
        isActive: true,
        isVerified: true,
        profile: { id: true, isActive: true },
      },
    });

    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    if (!user.isActive)
      throw new NotFoundException(`User ${email} is inactive`);

    if (!user.isVerified) {
      await this.sendEmailVerifyUser(user as User);
      throw new BadRequestException(
        `User ${email} is not verified, please check your email for verify your account`,
      );
    }

    if (!user.profile || !user.profile.isActive)
      throw new NotFoundException(`User don't have a profile assigned`);

    await this._commonService.comparePassword(
      password,
      user.password,
      'Credentials are not valid',
    );

    const token = await this._commonService.createJwtToken(
      { id: user.id },
      this._configService.get('TIME_TOKEN'),
      this._configService.get('JWT_SECRET'),
    );
    const refreshToken = await this._commonService.createJwtToken(
      { id: user.id },
      `${this._configService.get(
        'TIME_TOKEN_REFRESH',
      )}${this._configService.get('TYPE_TIME_TOKEN_REFRES')}`,
      this._configService.get('REFRESH_TOKEN_SECRET'),
    );

    await this.createRefreshTokenUser(user.id, refreshToken);

    delete user.password;

    return {
      user,
      token,
      refreshToken,
    };
  }

  async createRefreshTokenUser(userId: number, refreshToken: string) {
    const updaterefreshTokenUser = this._refreshTokenRepository.create({
      refreshToken,
      user: { id: userId },
      dateValid: moment()
        .tz('America/El_Salvador')
        .add(
          this._configService.get('TIME_TOKEN_REFRESH'),
          this._configService.get('TYPE_TIME_TOKEN_REFRES'),
        )
        .format(),
      active: true,
    });

    await this._refreshTokenRepository.save(updaterefreshTokenUser);
    return refreshToken;
  }

  async createTokenMailer(idUser: number, token: string) {
    const updaterefreshTokenUser = this._refreshTokenRepository.create({
      refreshToken: token,
      user: { id: idUser },
      dateValid: moment()
        .tz('America/El_Salvador')
        .add(
          '15',
          'minutes',
          // this._configService.get('TIME_TOKEN_EMAIL'),
          // this._configService.get('TYPE_TIME_TOKEN_REFRES'),
        )
        .format(),
      active: true,
    });

    await this._refreshTokenRepository.save(updaterefreshTokenUser);
  }

  async refreshTokens(refreshToken: string) {
    const findRefreshToken = await this._refreshTokenRepository.findOne({
      where: { refreshToken },
      relations: { user: true },
      select: {
        id: true,
        refreshToken: true,
        dateValid: true,
        user: { id: true },
      },
    });

    // const [tokensOld, count] = await this._refreshTokenRepository.findAndCount({
    //   where: { user: { id: user.id } },
    // });

    // if (!!count) {
    //   tokensOld.forEach(async (token) => {
    //     const desactive = await this._refreshTokenRepository.preload({
    //       id: token.id,
    //       active: false,
    //     });

    //     await this._refreshTokenRepository.save(desactive);
    //   });
    // }

    if (!findRefreshToken)
      throw new BadRequestException('Token expired, please sign in again');

    const user = await this._userRepository.findOne({
      where: { id: findRefreshToken.user.id },
      select: {
        email: true,
        id: true,
      },
    });
    const dateToken = moment(findRefreshToken.dateValid).valueOf();
    const DateNow = moment().tz('America/El_Salvador').valueOf();
    if (dateToken < DateNow) {
      await this.logout(user as any);
      throw new BadRequestException('Token expired, please sign in again');
    }
    const token = await this._commonService.createJwtToken(
      { id: findRefreshToken.user.id },
      this._configService.get('TIME_TOKEN'),
      this._configService.get('JWT_SECRET'),
    );

    return { token };
  }

  async sendEmailVerifyUser(user: User) {
    const token = await this._commonService.createJwtToken(
      { id: user.id },
      this._configService.get('TIME_TOKEN_EMAIL'),
      this._configService.get('EMAIL_TOKEN_SECRET'),
    );

    await this.createTokenMailer(user.id, token);

    await this._mailService.sendUserConfirmation(user.email, token);
    return {
      message: `Please check the email ${user.email} for verify your account`,
    };
  }

  async verifyUser(token: string) {
    const verifyToken = await this._commonService.ValidToken(
      token,
      this._configService.get('EMAIL_TOKEN_SECRET'),
    );

    await this._commonService.desactiveToken(token);

    const { id: userId } = verifyToken;
    const updateUser = await this._userRepository.preload({
      id: userId,
      isVerified: true,
      updatedAt: moment().tz('America/El_Salvador').format(),
    });
    await this._userRepository.save(updateUser);

    return {
      message: `Account verified successfully`,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email } = resetPasswordDto;
    const user = await this._usersService.findOneUser({ email });

    const token = await this._commonService.createJwtToken(
      { id: user.id },
      this._configService.get('TIME_TOKEN_EMAIL'),
      this._configService.get('EMAIL_TOKEN_SECRET'),
    );

    await this.createTokenMailer(user.id, token);
    await this._mailService.sendEmailResetPassword(user.email, token);

    return {
      message: 'Please check your email',
      // token,
    };
  }

  async createNewPassword(token: string, password: string) {
    const verifyToken = await this._commonService.ValidToken(
      token,
      this._configService.get('EMAIL_TOKEN_SECRET'),
    );

    await this._commonService.desactiveToken(token);

    const { id: userId } = verifyToken;

    await this._usersService.updatePassword(password, userId);

    return {
      message: 'Password created successfully',
    };
  }

  async logout(user: userData) {
    //search refreshToken this user
    const [refreskTokens, count] =
      await this._refreshTokenRepository.findAndCount({
        where: { user: { id: user.id } },
      });

    if (!!count) {
      await this._refreshTokenRepository
        .createQueryBuilder('refreshToken')
        .delete()
        .where('id IN (:...ids)', {
          ids: refreskTokens.map((token) => token.id),
        })
        .execute();
    }
  }
}
