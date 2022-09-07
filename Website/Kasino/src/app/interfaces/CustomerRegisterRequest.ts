export interface CustomerRegisterRequest {
  email: string;
  password: string;
  countryID: number;
  phoneNumber: number;
  cprNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  zipCodeID: number;
  genderID: number;
}
