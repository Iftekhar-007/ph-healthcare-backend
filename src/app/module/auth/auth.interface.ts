export interface IORegisterInfoType {
  name: string;
  email: string;
  password: string;
}

export interface IOLogInInfoType {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
