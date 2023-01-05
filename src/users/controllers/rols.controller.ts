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
import { Auth } from '../../auth/decorators/auth.decorator';
import { CreateRolDto, SearchRolDto, UpdateRolDto } from '../dto/rol.dto';
import { RolsService } from '../services/rols.service';
import { ValidRols } from '../../common/interfaces/enums/validRols.enum.';

@ApiBearerAuth()
@ApiTags('Rols')
@Controller('rols')
export class RolsController {
  constructor(private readonly _rolsService: RolsService) {}

  @ApiOperation({ summary: 'Get Rols' })
  @Get()
  @Auth(ValidRols.getRol, ValidRols.adminGetRol)
  getAll(@Query() searchRolDto: SearchRolDto) {
    return this._rolsService.getAllRols(searchRolDto);
  }

  @ApiOperation({ summary: 'Create Rol' })
  @Post()
  @Auth(ValidRols.adminCreateRol)
  create(@Body() createRolDto: CreateRolDto) {
    return this._rolsService.createRol(createRolDto);
  }

  @ApiOperation({ summary: 'Find One Rol' })
  @Get(':id')
  @Auth(ValidRols.getRol, ValidRols.adminGetRol)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._rolsService.getOneRol(id);
  }

  @ApiOperation({ summary: 'Update Rol' })
  @Put(':id')
  @Auth(ValidRols.adminUpdateRol)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRolDto: UpdateRolDto,
  ) {
    return this._rolsService.updateRol(id, updateRolDto);
  }

  @ApiOperation({ summary: 'Delete Rol' })
  @Delete(':id')
  @Auth(ValidRols.adminDeleteRol)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this._rolsService.deleteRol(id);
  }

  @ApiOperation({ summary: 'Restore Rol' })
  @Post(':id')
  @Auth(ValidRols.adminRestoreRol)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this._rolsService.restoreRol(id);
  }
}
