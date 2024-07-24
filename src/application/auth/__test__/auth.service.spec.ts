import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationMailService } from 'src/domain/ports/integrations/mailer/mailer.service';
import { UserRepository } from 'src/domain/ports/repository/user.repository';
import { DuplicateUser } from 'src/domain/user/errors/duplicate_user.error';
import { UserNotFound } from 'src/domain/user/errors/user_not_found';
import { WrongPassword } from 'src/domain/user/errors/wrong_password';
import { UserEntity } from 'src/domain/user/user.entity';
import { AuthService } from '../auth.service';
import { PasswordEncryptor } from '../helper/password_encryptor';


describe('AuthService', () => {
    let service: AuthService;
    let userRepository: UserRepository
    let jwtService: JwtService
    let notificationMailService: NotificationMailService
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: UserRepository,
                useValue: {
                    findByEmail: jest.fn(() => { }),
                    save: jest.fn(() => { })
                }
            },
            {
                provide: NotificationMailService,
                useValue: {
                    sendMail: jest.fn(() => { })
                }
            },
            {
                provide: JwtService,
                useValue: {
                    sign: jest.fn()
                }
            },
                AuthService],
        }).compile();
        notificationMailService = module.get<NotificationMailService>(NotificationMailService)
        jwtService = module.get<JwtService>(JwtService)
        service = module.get<AuthService>(AuthService);
        userRepository = module.get<UserRepository>(UserRepository)
    });

    describe('login', () => {
        it('should return a token if theres a user with x email', async () => {
            const token = "jwt-token"
            const password = "12345"
            const email = "josemoraleswatanabe@gmail.com"
            const entity = new UserEntity(email, 'hashed-password')
            entity.id = 'auto-generado'
            userRepository.findByEmail = jest.fn().mockResolvedValueOnce(entity)
            PasswordEncryptor.comparePassword = jest.fn().mockReturnValue(true)
            jwtService.sign = jest.fn().mockReturnValueOnce(token)
            const response = await service.login({ email, password })
            expect(response).toEqual({ access_token: token });
        });
        it('should throw User Not Found if no user holds x email', async () => {
            const password = "12345"
            const email = "josemoraleswatanabe@gmail.com"
            userRepository.findByEmail = jest.fn().mockResolvedValueOnce(null)
            expect(service.login({ email, password })).rejects.toThrow(new UserNotFound(email))
        });
        it('should throw Wrong Password if input password and stored password dont match', async () => {
            const password = "12345"
            const email = "josemoraleswatanabe@gmail.com"
            const entity = new UserEntity(email, 'hashed-password')
            entity.id = 'auto-generado'
            userRepository.findByEmail = jest.fn().mockResolvedValueOnce(entity)
            PasswordEncryptor.comparePassword = jest.fn().mockReturnValue(false)
            expect(service.login({ email, password })).rejects.toThrow(new WrongPassword())
        });
    })

    describe('createUser', () => {
        it('should successfully pass if a new user has just stored', async () => {
            const password = "12345"
            const hashedPassword = "hashed-password"
            const email = "josemoraleswatanabe@gmail.com"
            const entity = new UserEntity(email, hashedPassword)
            userRepository.save = jest.fn()
            PasswordEncryptor.getHashPassword = jest.fn().mockReturnValueOnce(hashedPassword)
            notificationMailService.sendWelcomeEmail = jest.fn()
            await service.register({ email, password })
            expect(userRepository.save).toBeCalledWith(entity)
            expect(notificationMailService.sendWelcomeEmail).lastCalledWith(email)
        });
        it("should throw a Duplicate User if there's already a user with the same email", async () => {
            const email: string = "cucurella@gmail.com"
            const password: string = 'hashed-password'
            const expected = new DuplicateUser(email)
            userRepository.save = jest.fn().mockRejectedValueOnce(expected)
            expect(service.register({ email, password })).rejects.toThrow(expected)
        });

    })


});