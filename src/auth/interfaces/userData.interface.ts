export interface userData {
  id: number;
  email: string;
  password?: string;
  profile?: {
    name: string;
    active: boolean;
    rols?: string[];
  };
}
