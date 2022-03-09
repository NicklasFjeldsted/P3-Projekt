export interface IUser {
	email: string;
	fullName: string;
}

export class User
{
  constructor()
  {
    this.id = null;
    this.email = null;
    this.firstName = null;
    this.lastName = null;
    this.jwtToken = null;
  }

  id: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  jwtToken: string | null;
}
