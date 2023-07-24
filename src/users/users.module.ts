import { forwardRef, Module } from '@nestjs/common';
import { Entities } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Controllers } from './controllers';
import { Services } from './services';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([...Entities]),
    forwardRef(() => CommonModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [...Controllers],
  providers: [...Services],
  exports: [...Services, TypeOrmModule],
})
export class UsersModule {}
