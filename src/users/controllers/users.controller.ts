import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';

import { Auth } from '../../auth/decorators/auth.decorator';
import { GetUser } from '../../auth/decorators/getUser.decorator';
import { userData, ValidRols } from '../../auth/interfaces';
import { BadRequestException } from '@nestjs/common';
import {
  UpdateUserDto,
  searchUserDto,
  CreateUserDto,
  ChangePasswordDto,
} from '../dto/user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Find Users' })
  @Get()
  @Auth(ValidRols.adminGetUser, ValidRols.getUser)
  // @UsePipes(new ValidationPipe({ transform: true })) // usar valores por defecto si no los envian
  findAll(@Query() params: searchUserDto) {
    return this.usersService.findAllUsers(params);
  }

  @ApiOperation({ summary: 'Create User' })
  @Post()
  @Auth(ValidRols.createUser, ValidRols.adminCreateUser)
  async create(@Body() createUser: CreateUserDto) {
    return await this.usersService.createUser(createUser);
  }

  // @Post('upload')
  // @UseInterceptors(FilesInterceptor('file'))
  // uploadUsers(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({ fileType: 'xls' })
  //       .addFileTypeValidator({ fileType: 'xlsx' })
  //       .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   console.log(file);
  // }

  // @Post('upload/avatar')
  // @UseInterceptors(FileInterceptor('avatar', { dest: './../../uploads' }))
  // uploadAvatar(@UploadedFile() avatar: Express.Multer.File) {
  //   console.log(avatar);
  // }
  @ApiOperation({ summary: 'Find One User' })
  @Get(':id')
  @Auth(ValidRols.getUser, ValidRols.adminGetUser)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneUser({ id });
  }

  @ApiOperation({ summary: 'Update User' })
  @Put(':id')
  @Auth(ValidRols.updateUser, ValidRols.adminUpdateUser)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete User' })
  @Delete(':id')
  @Auth(ValidRols.adminDeleteUser)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @ApiOperation({ summary: 'Restore User' })
  @Post(':id')
  @Auth(ValidRols.adminRestoreUser)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.restoreUser(id);
  }

  @ApiOperation({ summary: 'Change Password' })
  @Post('change/password')
  @Auth(ValidRols.getUser, ValidRols.adminGetUser)
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: userData,
  ) {
    if (changePasswordDto.password !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(`Confim password doesn't match`);
    }
    return this.usersService.changePassword(changePasswordDto, user);
  }
}
