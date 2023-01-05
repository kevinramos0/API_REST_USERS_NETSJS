import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

// import { ValidRols } from '../auth/interfaces';
// import { Auth } from '../auth/decorators/auth.decorator';

import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValidRols.admin)
  @ApiExcludeEndpoint()
  executeSeed() {
    return this.seedService.initSeed();
  }
}
