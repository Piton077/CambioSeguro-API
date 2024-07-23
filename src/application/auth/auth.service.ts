import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashSync } from 'bcryptjs';
import { UserEntity } from 'src/domain/user.entity';
import { UserRepository } from 'src/domain/user.repository';
import { LoginInputDto } from './dto/input/login.input.dto';
import { SignUpInputDto } from './dto/input/signup.input.dto';
import { AuthOutputDto } from './dto/output/auth.output.dto';



@Injectable()
export class AuthService {
    constructor(
        @Inject(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async login(user: LoginInputDto): Promise<AuthOutputDto> {
        const userEntity = await this.userRepository.findByEmail(user.email);
        if (!userEntity) return null
        const payload = { username: userEntity.username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(newUser: SignUpInputDto) {
        const hashedPassword = hashSync(newUser.password, +process.env.PASSWORD_ENCRYPTION_ROUNDS);
        const user = new UserEntity(newUser.email, hashedPassword);
        await this.userRepository.save(user);

    }
}
