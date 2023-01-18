import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone';

interface IProfiles {
  name: string;
  description: string;
  isActive: boolean;
  createAt: string;
  rols: number[];
  modules: number[];
}

interface IRols {
  name: string;
  description: string;
  isActive: boolean;
  createAt: string;
}

interface IUsers {
  email: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
  createAt: string;
}

interface IModules {
  name: string;
  description: string;
  isActive: boolean;
}

interface SeedData {
  Profile: IProfiles;
  Rols: IRols[];
  User: IUsers;
  Modules: IModules[];
}

export const initSeedData: SeedData = {
  Rols: [
    {
      name: 'Admin',
      description: 'rol for admin user',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Get User',
      description: 'rol for get users',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Create User',
      description: 'rol for create users',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Update User',
      description: 'rol for update users',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Get Profile',
      description: 'rol for update users',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },

    {
      name: 'Get Rol',
      description: 'rol for update users',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Get Module',
      description: 'rol for update users',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Get User',
      description: 'rol for get users',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Create User',
      description: 'rol for create users',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Update User',
      description: 'rol for update users',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },

    {
      name: 'Admin Delete User',
      description: 'rol for delete users',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Restore User',
      description: 'rol for restore users',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Get Profile',
      description: 'rol for get profiles',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Create Profile',
      description: 'rol for create profiles',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Update Profile',
      description: 'rol for update profiles',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Delete Profile',
      description: 'rol for delete profiles',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Restore Profile',
      description: 'rol for restore profiles',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Get Rol',
      description: 'rol for get rols',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Create Rol',
      description: 'rol for create rols',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Update Rol',
      description: 'rol for update rols',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Delete Rol',
      description: 'rol for delete rols',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Restore Rol',
      description: 'rol for restore rols',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Get Module',
      description: 'rol for get modules',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Create Module',
      description: 'rol for create modules',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Update Module',
      description: 'rol for update modules',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Delete Module',
      description: 'rol for delete modules',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
    {
      name: 'Admin Restore Module',
      description: 'rol for restore modules',
      isActive: true,
      createAt: moment().tz('America/El_Salvador').format(),
    },
  ],
  Modules: [
    {
      name: 'Users',
      description: 'module for management users',
      isActive: true,
    },
    {
      name: 'Profiles',
      description: 'module for management profiles',
      isActive: true,
    },
    {
      name: 'Rols',
      description: 'module for management rols',
      isActive: true,
    },
    {
      name: 'Modules',
      description: 'management modules',
      isActive: true,
    },
  ],
  Profile: {
    name: 'Administrator',
    description: 'administrator of system',
    isActive: true,
    createAt: moment().tz('America/El_Salvador').format(),
    rols: [1],
    modules: [1, 2, 3, 4],
  },
  User: {
    email: 'administrator@email.com',
    password: bcrypt.hashSync('admin', 10),
    isActive: true,
    isVerified: true,
    createAt: moment().tz('America/El_Salvador').format(),
  },
};
