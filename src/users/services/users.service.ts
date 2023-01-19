import { FindManyOptions, FindOptionsWhere, Repository, ILike } from 'typeorm';
import * as moment from 'moment-timezone';
import * as bcrypt from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProfilesService } from './profiles.service';
import { CommonService } from '../../common/services/common.service';
import { User } from '../entities';
import {
  CreateUserDto,
  UpdateUserDto,
  searchUserDto,
  FindOneUserDto,
} from '../dto/user.dto';
import { ChangePasswordDto } from '../dto/user.dto';
import { userData } from '../../auth/interfaces/userData.interface';
import { ConflictException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @Inject(ProfilesService)
    private readonly _profileRepository: ProfilesService,
    @Inject(CommonService)
    private readonly _commonService: CommonService,
    @Inject(forwardRef(() => AuthService))
    private readonly _authService: AuthService,
  ) {}

  async findAllUsers(params: searchUserDto) {
    // params to pagination
    const { limit = 10, offset = 1, pagination = true } = params;

    //params to filter
    const { email, active } = params;

    const findOptions: FindManyOptions<User> = {};
    const where: FindOptionsWhere<User> = {};

    if (email) where.email = ILike(`%${email || ''}%`);
    if (active !== undefined) where.isActive = active;

    if (pagination) {
      findOptions.take = limit;
      findOptions.skip = limit * (offset - 1);
    }
    findOptions.relations = { profile: true };
    findOptions.where = where;
    findOptions.order = { email: 'ASC' };
    findOptions.select = { profile: { id: true, name: true } };

    const [users, count] = await this._userRepository.findAndCount(findOptions);
    return {
      users,
      pagination: {
        limit: pagination ? limit : count,
        offset: pagination ? limit : 1,
        total: count,
      },
    };
  }

  async findOneUser(findUserDto: FindOneUserDto) {
    const { id, email } = findUserDto;
    const userQuery = this._userRepository
      .createQueryBuilder('user')
      .leftJoin('user.profile', 'profile');

    if (id) {
      userQuery.where('user.id = :id', { id });
    } else if (email) {
      userQuery.where('user.email =:email', { email });
    }

    userQuery.select([
      'user.id',
      'user.email',
      'user.isActive',
      'user.isVerified',
      'user.createdAt',
      'user.updatedAt',
      'profile.name',
      'profile.id',
    ]);
    const user = await userQuery.getOne();

    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async createUser(createUserDTO: CreateUserDto) {
    const { password, profile, ...userData } = createUserDTO;

    //search find user with email
    const existEmail = await this._userRepository.findOne({
      where: { email: userData.email },
    });

    if (existEmail)
      throw new BadRequestException('This email used for other User');

    if (profile) {
      await this._profileRepository.findOneProfile(profile);
    }
    const newUser = this._userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
      isActive: true,
      profile: { id: profile },
      createdAt: moment().tz('America/El_Salvador').format(),
    });

    await this._userRepository.save(newUser);

    // send email for verification
    // const { message } = await this._authService.sendEmailVerifyUser(
    //   newUser as User,
    // );
    delete newUser.password; // not show password

    return newUser;

    // return emailVerification;
  }

  async updateUser(id: number, updateUserDTO: UpdateUserDto): Promise<User> {
    await this.findOneUser({ id }); //search if exist user
    const { profile, ...userData } = updateUserDTO;
    const user = await this._userRepository.preload({
      id,
      updatedAt: moment().tz('America/El_Salvador').format(),
      profile: { id: profile },
      ...userData,
    });
    await this._userRepository.save(user);
    return user;
  }

  /** @deprecated ya no se usa */
  async deleteUserOld(id: number): Promise<object> {
    await this.findOneUser({ id });
    const user = await this._userRepository.preload({
      id,
      isActive: false,
      updatedAt: moment().tz('America/El_Salvador').format(),
    });
    await this._userRepository.save(user);
    return { message: 'User deleted successfully' };
  }

  async deleteUser(id: number) {
    await this.findOneUser({ id });
    await this._userRepository.softDelete(id);

    return { message: 'User deleted successfully' };
  }

  async restoreUser(id: number) {
    const user = await this._userRepository.restore(id);
    if (!user.affected) throw new ConflictException();

    return user;
  }

  async changePassword(changePasswordDto: ChangePasswordDto, user: userData) {
    const { oldPassword, password } = changePasswordDto;

    if (oldPassword === password)
      throw new BadRequestException(
        `the new password can't be the same as the current password`,
      );

    const { password: userPassword } = await this._userRepository.findOne({
      where: { id: user.id },
      select: { password: true },
    });

    await this._commonService.comparePassword(
      oldPassword,
      userPassword,
      `Current password doesn't match`,
    );

    await this.updatePassword(password, user.id);

    return {
      message: 'Password changed successfully, please sign in again',
    };
  }

  async updatePassword(password: string, idUser: number) {
    await this.findOneUser({ id: idUser }); //search if exist user

    const updateUserPassword = await this._userRepository.preload({
      id: idUser,
      password: await bcrypt.hash(password, 10),
      updatedAt: moment().tz('America/El_Salvador').format(),
    });

    await this._userRepository.save(updateUserPassword);

    return updateUserPassword;
  }
}
