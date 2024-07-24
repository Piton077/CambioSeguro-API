import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationMailService } from 'src/domain/ports/integrations/mailer/mailer.service';
import { UserRepository } from 'src/domain/ports/repository/user.repository';
import { UserNotFound } from 'src/domain/user/errors/user_not_found';
import { WrongPassword } from 'src/domain/user/errors/wrong_password';
import { UserEntity } from 'src/domain/user/user.entity';
import { LoginInputDto } from './dto/input/login.input.dto';
import { SignUpInputDto } from './dto/input/signup.input.dto';
import { AuthOutputDto } from './dto/output/auth.output.dto';
import { PasswordEncryptor } from './helper/password_encryptor';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        @Inject(NotificationMailService)
        private readonly notificationMailService: NotificationMailService,
    ) { }

    async login(user: LoginInputDto): Promise<AuthOutputDto> {
        const userEntity = await this.userRepository.findByEmail(user.email);
        if (!userEntity) throw new UserNotFound(user.email);
        if (!PasswordEncryptor.comparePassword(user.password, userEntity.password)) {
            throw new WrongPassword();
        }
        const payload = { email: userEntity.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(newUser: SignUpInputDto) {
        const hashedPassword = PasswordEncryptor.getHashPassword(newUser.password);
        const user = new UserEntity(newUser.email, hashedPassword);
        const newEntity = await this.userRepository.save(user);
        await this.notificationMailService.sendWelcomeEmail(user.email);
        return newEntity
    }

}
