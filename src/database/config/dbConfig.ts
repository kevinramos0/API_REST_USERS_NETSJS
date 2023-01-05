import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly configService: ConfigService;
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      database: this.configService.get('DB_DATABASE') || 'api_typescript',
      port: this.configService.get('DB_PORT') || 5432,
      password: this.configService.get('DB_PASSWORD') || 'admin',
      username: this.configService.get('DB_USERNAME') || 'admin',
      host: this.configService.get('DB_HOST') || 'localhost',
      logging: !!this.configService.get('DB_LOGGING') === true,
      synchronize: !!this.configService.get('DB_SYNCHRONIZE') === true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
    };
  }
}
