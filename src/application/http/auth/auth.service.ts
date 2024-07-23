import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcryptjs';
import { NotificationMailService } from 'src/domain/ports/integrations/mailer/mailer.service';
import { UserRepository } from 'src/domain/ports/repository/user.repository';
import { NotFoundUser } from 'src/domain/user/errors/not_found_user.error';
import { WrongPassword } from 'src/domain/user/errors/wrong_password';
import { UserEntity } from 'src/domain/user/user.entity';
import { LoginInputDto } from './dto/input/login.input.dto';
import { SignUpInputDto } from './dto/input/signup.input.dto';
import { AuthOutputDto } from './dto/output/auth.output.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject(NotificationMailService)
    private readonly notificationMailService: NotificationMailService,
  ) {}

  async login(user: LoginInputDto): Promise<AuthOutputDto> {
    const userEntity = await this.userRepository.findByEmail(user.email);
    if (!userEntity) throw new NotFoundUser(user.email);
    if (!this.comparePassword(user.password, userEntity.password)) {
      throw new WrongPassword();
    }
    const payload = { email: userEntity.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(newUser: SignUpInputDto) {
    const hashedPassword = this.getHashPassword(newUser.password);
    const user = new UserEntity(newUser.email, hashedPassword);
    await this.userRepository.save(user);
    await this.notificationMailService.sendWelcomeEmail(user.email);
  }
  private comparePassword(inputPassword: string, userPassword: string) {
    return compareSync(inputPassword, userPassword);
  }
  private getHashPassword(password: string) {
    return hashSync(password, +process.env.PASSWORD_ENCRYPTION_ROUNDS);
  }
}
