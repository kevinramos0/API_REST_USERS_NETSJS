import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/getUser.decorator';
import { LoginUserDto, ResetPasswordDto } from './dto/auth.dto';
import { userData } from './interfaces';
import { CreateNewPasswordDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign In' })
  @Post('login')
  login(@Body() logindto: LoginUserDto) {
    return this.authService.login(logindto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  @Auth()
  logout(@GetUser() user: userData) {
    return this.authService.logout(user);
  }

  @ApiOperation({ summary: 'Reset password' })
  @Post('reset/password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: 'Create new password' })
  @Post('create/password/:token')
  changePassword(
    @Param('token') token: string,
    @Body() createPasswordDto: CreateNewPasswordDto,
  ) {
    if (createPasswordDto.password !== createPasswordDto.confirmPassword) {
      throw new BadRequestException(`password doesn't match`);
    }
    return this.authService.createNewPassword(
      token,
      createPasswordDto.password,
    );
  }

  @ApiOperation({ summary: 'Verify account' })
  @Get('verify/account/:token')
  verifyAccount(@Param('token') token: string) {
    return this.authService.verifyUser(token);
  }

  @ApiOperation({ summary: 'Create new Token' })
  @Get('refresh/:refreshToken')
  refreshToken(@Param('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
