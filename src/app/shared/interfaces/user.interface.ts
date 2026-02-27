export interface Permission {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role?: Role;
  roles?: Role[];
  active: number;
}
