export interface IUser {
  email: string;
  fullName: string;
  customerID: number;
}

export class UserData
{
  private fullName: string | null;
  private email: string | null;
  private customerID: number | null;

  public get FullName(): string { return this.fullName ?? ""; }
	public set FullName(value: string) { this.fullName = value; }

	public get Email(): string { return this.email ?? ""; }
  public set Email(value: string) { this.email = value; }
  
  public get CustomerID(): number { return this.customerID ?? -1; }
  public set CustomerID(value: number) { this.customerID = value; }
  
  constructor(name?: string, mail?: string, id?: number)
  {
    this.fullName = name ? name : null;
    this.email = mail ? mail : null;
    this.customerID = id ? id : null;
  }

  public Update(newData: UserData): void
	{
		for (const prop in this)
		{
			for (const [key, value] of Object.entries(newData))
			{
				if (key != prop) continue;
				
				if (value == null) continue;
	
				this[prop] = value;
			}
		}
  }
  
  public static Parse(data: any): IUser
	{
		let parsedPlayerDataObject: any = {};
		for (const index in data)
		{
			parsedPlayerDataObject[ this.FirstCharToLowerCase(index) ] = data[index];
		}
		return parsedPlayerDataObject;
	}

	private static FirstCharToLowerCase(string: string): string
	{
		return string.charAt(0).toLocaleLowerCase() + string.slice(1)
	}
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
