import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginInputDto {
  @IsNotEmpty()
  password: string;
  @IsEmail()
  email: string;
}
