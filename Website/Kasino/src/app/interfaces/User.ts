export interface IUser {
  email: string;
  fullName: string;
}

export class UserData {
  email: string;
  fullName: string;
}

export class User {
  constructor() {
    this.id = null;
    this.email = null;
    this.firstName = null;
    this.lastName = null;
    this.role = null;
    this.jwtToken = null;
  }

  id: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  jwtToken: string | null;

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
