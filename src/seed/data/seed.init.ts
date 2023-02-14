import * as bcrypt from 'bcrypt';

interface IProfiles {
  name: string;
  description: string;
  isActive: boolean;
  // rols: number[];
  // modules: number[];
}

interface IRols {
  name: string;
  description: string;
  isActive: boolean;
}

interface IUsers {
  email: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
}

interface IModules {
  name: string;
  nameRoute: string;
  description: string;
  icon: string;
  isActive: boolean;
  isPublic: boolean;
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
    },
    {
      name: 'Get User',
      description: 'rol for get users',
      isActive: true,
    },
    {
      name: 'Create User',
      description: 'rol for create users',
      isActive: true,
    },
    {
      name: 'Update User',
      description: 'rol for update users',
      isActive: true,
    },
    {
      name: 'Get Profile',
      description: 'rol for update users',
      isActive: true,
    },

    {
      name: 'Get Rol',
      description: 'rol for update users',
      isActive: true,
    },
    {
      name: 'Get Module',
      description: 'rol for update users',
      isActive: true,
    },
    {
      name: 'Admin Get User',
      description: 'rol for get users',
      isActive: true,
    },
    {
      name: 'Admin Create User',
      description: 'rol for create users',
      isActive: true,
    },
    {
      name: 'Admin Update User',
      description: 'rol for update users',
      isActive: true,
    },

    {
      name: 'Admin Delete User',
      description: 'rol for delete users',
      isActive: true,
    },
    {
      name: 'Admin Restore User',
      description: 'rol for restore users',
      isActive: true,
    },
    {
      name: 'Admin Get Profile',
      description: 'rol for get profiles',
      isActive: true,
    },
    {
      name: 'Admin Create Profile',
      description: 'rol for create profiles',
      isActive: true,
    },
    {
      name: 'Admin Update Profile',
      description: 'rol for update profiles',
      isActive: true,
    },
    {
      name: 'Admin Delete Profile',
      description: 'rol for delete profiles',
      isActive: true,
    },
    {
      name: 'Admin Restore Profile',
      description: 'rol for restore profiles',
      isActive: true,
    },
    {
      name: 'Admin Get Rol',
      description: 'rol for get rols',
      isActive: true,
    },
    {
      name: 'Admin Create Rol',
      description: 'rol for create rols',
      isActive: true,
    },
    {
      name: 'Admin Update Rol',
      description: 'rol for update rols',
      isActive: true,
    },
    {
      name: 'Admin Delete Rol',
      description: 'rol for delete rols',
      isActive: true,
    },
    {
      name: 'Admin Restore Rol',
      description: 'rol for restore rols',
      isActive: true,
    },
    {
      name: 'Admin Get Module',
      description: 'rol for get modules',
      isActive: true,
    },
    {
      name: 'Admin Create Module',
      description: 'rol for create modules',
      isActive: true,
    },
    {
      name: 'Admin Update Module',
      description: 'rol for update modules',
      isActive: true,
    },
    {
      name: 'Admin Delete Module',
      description: 'rol for delete modules',
      isActive: true,
    },
    {
      name: 'Admin Restore Module',
      description: 'rol for restore modules',
      isActive: true,
    },
  ],
  Modules: [
    {
      name: 'Users',
      nameRoute: 'users',
      description: 'module for management users',
      icon: 'mdi-account-group',
      isPublic: false,
      isActive: true,
    },
    {
      name: 'Profiles',
      nameRoute: 'profiles',
      description: 'modules for management profiles',
      icon: 'mdi-account-tie',
      isPublic: false,
      isActive: true,
    },
    {
      name: 'Rols',
      nameRoute: 'rols',
      description: 'module for management rols',
      icon: 'mdi-account-cog',
      isPublic: false,
      isActive: true,
    },
  ],
  Profile: {
    name: 'Administrator',
    description: 'administrator of system',
    isActive: true,
    // rols: [1],
    // modules: [1, 2, 3],
  },
  User: {
    email: 'administrator@email.com',
    password: bcrypt.hashSync('admin', 10),
    isActive: true,
    isVerified: true,
  },
};
