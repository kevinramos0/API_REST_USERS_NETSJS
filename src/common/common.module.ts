import { Module, forwardRef } from '@nestjs/common';
import { CommonService } from './services/common.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
