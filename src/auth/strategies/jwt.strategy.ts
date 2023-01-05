import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../users/entities';
import { JwtPayload } from '../interfaces';
import { userData } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,

    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;

    const user = await this._userRepository
      .createQueryBuilder('user')
      .leftJoin('user.profile', 'profile')
      .where('user.id =:id', { id })
      .leftJoin('profile.rols', 'rolsProfile')
      .leftJoin('rolsProfile.rol', 'rols')
      .select([
        'user.id',
        'user.email',
        // 'user.password',
        'profile.name',
        'profile.isActive',
        'rolsProfile',
        'rols.name',
      ])
      .getOne();

    const token = await this._userRepository
      .createQueryBuilder('user')
      .leftJoin('user.refreshToken', 'token')
      .where('token.user.id =:id', { id })
      .select(['token.id', 'token.refreshToken'])
      .orderBy('token.id', 'DESC')
      .getCount();

    if (!user) throw new UnauthorizedException('User not found');

    const UserData = {} as userData;
    UserData.id = user.id;
    UserData.email = user.email;
    // UserData.password = user.password;

    if (user.profile !== null) {
      UserData.profile = {
        name: user.profile.name,
        active: user.profile.isActive,
        rols: user.profile?.rols.map((rol) => rol.rol.name),
      };
    }
    return {
      user: UserData,
      token,
    };
  }
}
