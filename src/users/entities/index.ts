import { Profile } from './profile.entity';
import { User } from './user.entity';
import { refreshToken } from './refreshToken.entity';
import { Rol } from './rol.entity';
import { ProfileRols } from './profile-rols.entity';
import { Modules } from './modules.entity';
import { ProfileModules } from './profile-module.entity';

// export entidades para usar en controllers, services, ...
export {
  User,
  Profile,
  Rol,
  refreshToken,
  ProfileRols,
  Modules,
  ProfileModules,
};

// array para importar las entidades en el modulo
export const Entities = [
  Profile,
  User,
  refreshToken,
  Rol,
  ProfileRols,
  Modules,
  ProfileModules,
];
