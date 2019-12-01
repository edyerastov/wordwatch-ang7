export interface IDevice {
  id: string;
  isAllocated: boolean;
  name: string;
  userFullName: string;
  userId: string;
}

export interface IGroup {
  id: string;
  name: string;
  type: string;
}

export interface IUser {
  active: boolean;
  adUser: boolean;
  email: string;
  forceChangePassword: boolean;
  fullName: string;
  id: string;
  roleName: string;
  userName: string;
}
