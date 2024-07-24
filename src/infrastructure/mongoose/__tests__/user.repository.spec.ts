import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { DuplicateUser } from 'src/domain/user/errors/duplicate_user.error';
import { UserEntity } from 'src/domain/user/user.entity';
import { User } from '../schemas/user.schema';
import { MongooseUserRepository } from '../user.repository';
import { MongooseUserRepositoryMock } from './user.repository.mock';



describe('Mongoose User Repository ', () => {
    let repository: MongooseUserRepository;
    let mockMongoose: Model<User>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: getModelToken(User.name),
                useValue: MongooseUserRepositoryMock
            }, MongooseUserRepository],
        }).compile();
        mockMongoose = module.get<Model<User>>(getModelToken(User.name))
        repository = module.get<MongooseUserRepository>(MongooseUserRepository);
    });
    describe('findByEmail', () => {
        it('should return an user entity plus id if any user holds x email', async () => {
            const email: string = "cucurella@gmail.com"
            const hashedPassword = 'hashed-password'
            const expected = new UserEntity(email, 'hashed-password')
            expected.id = 'auto-generado'
            MongooseUserRepositoryMock.setUsers([{ email, password: hashedPassword, id: 'auto-generado' }])
            const response = await repository.findByEmail(email)
            MongooseUserRepositoryMock.clearUsers()
            expect(response).toEqual(expected);
        });
        it('should return null if no user holds x email', async () => {
            const email: string = "cucurella2@gmail.com"
            const response = await repository.findByEmail(email)
            expect(response).toBeNull()
        });
    })

    describe('createUser', () => {
        it('should return an user entity if new user has just stored', async () => {
            const email: string = "cucurella@gmail.com"
            const hashedPassword = 'hashed-password'
            const user = new UserEntity(email, hashedPassword)
            const expected = new UserEntity(email, hashedPassword)
            expected.id = "auto-generado"
            const response = await repository.save(user)
            expect(response).toEqual(expected);
        });
        it("should throw a Duplicate User if there's already a user with the same email", async () => {
            const email: string = "cucurella@gmail.com"
            const hashedPassword = 'hashed-password'
            const user = new UserEntity(email, hashedPassword)
            const expected = new DuplicateUser(email)
            MongooseUserRepositoryMock.setUsers([{ email, password: hashedPassword, id: 'auto-generado' }])

            await expect(repository.save(user)).rejects.toThrow(expected)
        });

    })



});