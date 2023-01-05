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
        limit,
        offset,
        total: count,
      },
    };
  }

  async findOneUser(findUserDto: FindOneUserDto) {
    const { id, email } = findUserDto;
    const userQuery = this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');

    if (id) {
      userQuery.where('user.id = :id', { id });
    } else if (email) {
      userQuery.where('user.email =:email', { email });
    }
    userQuery.select([
      'user.id as id',
      'user.email as email',
      'user.isActive as active',
      'user.isVerified as verified',
      'user.createAt as created',
      'user.updateAt as updated',
      'profile.id as idProfile',
      'profile.name as profile',
      'profile.description as profile_description',
    ]);
    const user = await userQuery.getRawOne();

    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async createUser(createUserDTO: CreateUserDto) {
    const { password, ...userData } = createUserDTO;

    const newUser = this._userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
      createAt: moment().tz('America/El_Salvador').format(),
    });

    //search find user with email
    const existEmail = await this._userRepository.findOne({
      where: { email: userData.email },
    });

    if (existEmail)
      throw new BadRequestException('This email used for other User');

    // add profile
    if (userData.idProfile) {
      const profile = await this._profileRepository.findOneProfile(
        userData.idProfile,
      );
      newUser.profile = profile; //asign profile to user
    }
    await this._userRepository.save(newUser);

    // send email for verification
    const { message } = await this._authService.sendEmailVerifyUser(
      newUser as User,
    );
    delete newUser.password; // not show password

    return {
      newUser,
      message,
    };

    // return emailVerification;
  }

  async updateUser(id: number, updateUserDTO: UpdateUserDto): Promise<User> {
    await this.findOneUser({ id }); //search if exist user
    const { idProfile, ...userData } = updateUserDTO;
    const user = await this._userRepository.preload({
      id,
      updateAt: moment().tz('America/El_Salvador').format(),
      profile: { id: idProfile },
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
      updateAt: moment().tz('America/El_Salvador').format(),
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
      updateAt: moment().tz('America/El_Salvador').format(),
    });

    await this._userRepository.save(updateUserPassword);

    return updateUserPassword;
  }
}
