import jwtDecode from "jwt-decode";

export interface JwtPayloadPlus
{
	nameid: number;
	role: string;
	given_name: string;
	email: string;
	exp: number;
	nbf: number;
	iat: number;
}

export class JwtDecodePlus
{
	public static jwtDecode(token: string): JwtPayloadPlus
	{
		return jwtDecode(token);
	}
}