export interface IUser {
	email: string;
	fullName: string;
}

export class User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  jwtToken?: string;
}
