import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInputDto } from './dto/input/login.input.dto';
import { SignUpInputDto } from './dto/input/signup.input.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() request: LoginInputDto) {
    const response = await this.authService.login(request);
    if (!response)
      throw new NotFoundException(
        `No existe usuario con email ${request.email}`,
      );
    return response;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async singUp(@Body() request: SignUpInputDto) {
    await this.authService.register(request);
  }
}
