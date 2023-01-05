import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateProfileDto,
  searchProfileDTO,
  UpdateProfileDto,
} from '../dto/profile.dto';
import { ProfilesService } from '../services/profiles.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ValidRols } from '../../auth/interfaces';
import { ProfileModuleDTO } from '../dto/profile-module.dto';

@ApiBearerAuth()
@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @ApiOperation({ summary: 'Find Profiles' })
  @Get()
  @Auth(ValidRols.adminGetProfile)
  finAll(@Query() params: searchProfileDTO) {
    return this.profileService.findAllProfiles(params);
  }

  @ApiOperation({ summary: 'Create Profile' })
  @Post()
  @Auth(ValidRols.admincreateProfile)
  create(@Body() profileDto: CreateProfileDto) {
    return this.profileService.createProfile(profileDto);
  }

  @ApiOperation({ summary: 'Get Rols to Profile' })
  @Get('/:id/rols')
  @Auth(ValidRols.getProfile, ValidRols.getRol, ValidRols.adminGetProfile)
  findAllRoles(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.getRolsToProfile(id);
  }

  @ApiOperation({ summary: 'Get Modules to Profile' })
  @Get(':id/modules')
  @Auth(ValidRols.getProfile, ValidRols.getModule, ValidRols.adminGetProfile)
  getModules(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.getModulesProfile(id);
  }

  @ApiOperation({ summary: 'Add Modules to Profile' })
  @Post(':id/modules')
  @Auth(ValidRols.adminGetProfile, ValidRols.adminCreateModule)
  addModules(
    @Param('id', ParseIntPipe) id: number,
    @Body() { modules }: ProfileModuleDTO,
  ) {
    return this.profileService.addModulesToProfile(id, modules);
  }

  @ApiOperation({ summary: 'Find One Profile' })
  @Get(':id')
  @Auth(ValidRols.getProfile, ValidRols.adminGetProfile)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.findOneProfile(id);
  }

  @ApiOperation({ summary: 'Update Profile' })
  @Put(':id')
  @Auth(ValidRols.adminUpdateProfile)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(id, updateProfileDto);
  }

  @ApiOperation({ summary: 'Delete Modules to Profile' })
  @Delete(':id/modules/:idModule')
  @Auth(ValidRols.adminDeleteModule)
  deleteModule(
    @Param('id', ParseIntPipe) id: number,
    @Param('idModule', ParseIntPipe) idModule: number,
  ) {
    return this.profileService.deleteModuleProfile(id, idModule);
  }

  @ApiOperation({ summary: 'Delete Profile' })
  @Delete(':id')
  @Auth(ValidRols.adminDeleteProfile)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.deleteProfile(id);
  }

  @ApiOperation({ summary: 'Restore Profile' })
  @Post(':id')
  @Auth(ValidRols.adminRestoreProfile)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.restoreProfile(id);
  }
}
