import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { ModulesService } from '../services/modules.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ValidRols } from '../../common/interfaces/enums/validRols.enum.';
import {
  CreateModuleDto,
  FindModuleDto,
  UpdateModuleDto,
} from '../dto/module.dto';

@ApiBearerAuth()
@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly _modulesService: ModulesService) {}

  @ApiOperation({ summary: 'Find Modules' })
  @Get()
  @Auth(ValidRols.adminGetModule)
  findAll(@Query() params: FindModuleDto) {
    return this._modulesService.findAll(params);
  }

  @ApiOperation({ summary: 'Create Module' })
  @Post()
  @Auth(ValidRols.adminCreateModule)
  create(@Body() payloadCreateModule: CreateModuleDto) {
    return this._modulesService.create(payloadCreateModule);
  }

  @ApiOperation({ summary: 'Get One Module' })
  @Get(':id')
  @Auth(ValidRols.getModule, ValidRols.adminGetModule)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._modulesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Module' })
  @Put(':id')
  @Auth(ValidRols.adminUpdateModule)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payloadUpdateModule: UpdateModuleDto,
  ) {
    return this._modulesService.update(id, payloadUpdateModule);
  }

  @ApiOperation({ summary: 'Delete Module' })
  @Delete(':id')
  @Auth(ValidRols.adminDeleteModule)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this._modulesService.delete(id);
  }

  @ApiOperation({ summary: 'Restore Module' })
  @Post(':id')
  @Auth(ValidRols.adminRestoreModule)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this._modulesService.restore(id);
  }
}
