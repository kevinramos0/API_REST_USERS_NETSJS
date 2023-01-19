import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLS } from '../decorators/rolsProtected.decorator';
import { ValidRols as Rols } from '../interfaces';
import { userData } from '../interfaces';

@Injectable()
export class UserProfileGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRols: string[] = this.reflector.get(
      META_ROLS,
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();
    const user = req.user.user as userData;
    const token = req.user.token;

    if (!validRols || validRols.length === 0) return true;

    if (!user) throw new BadRequestException('User not found');
    if (token === 0) throw new UnauthorizedException('Unauthorized');

    const { profile } = user;
    // if (!profile)
    //   throw new BadRequestException(`User don't have a profile assigned`);

    // if (!profile.active) throw new BadRequestException(`Profile is Inactive`);

    if (profile.rols.includes(Rols.admin)) return true;

    const filtro = [...validRols.filter((rol) => profile.rols.includes(rol))];
    if (filtro.length > 0) return true;

    throw new ForbiddenException(`Forbidden`);
  }
}
