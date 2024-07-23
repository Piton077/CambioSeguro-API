import { UserEntity } from 'src/domain/user/user.entity';

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<void>;
}

export const UserRepository = Symbol('UserRepository');
