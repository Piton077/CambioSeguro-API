import { IsEmail, IsNotEmpty } from "class-validator";

export class SignUpInputDto {
  @IsNotEmpty()
  password: string;
  @IsEmail()
  email: string;
}
