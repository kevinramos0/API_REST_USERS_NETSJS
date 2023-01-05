import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserProfileGuard } from '../guards/userProfile.guard';
import { ValidRols } from '../interfaces';
import { RolsProtected } from './rolsProtected.decorator';

export function Auth(...rols: ValidRols[]) {
  return applyDecorators(
    RolsProtected(...rols),
    UseGuards(AuthGuard(), UserProfileGuard),
  );
}
