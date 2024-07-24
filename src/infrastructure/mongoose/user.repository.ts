import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserRepository } from 'src/domain/ports/repository/user.repository';
import { DuplicateUser } from 'src/domain/user/errors/duplicate_user.error';
import { UserEntity } from 'src/domain/user/user.entity';
import { User } from './schemas/user.schema';

@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    const entity = new UserEntity(user.email, user.password);
    entity.id = user.id;
    return entity;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    try {
      const newUserModel = new this.userModel({
        email: user.email,
        password: user.password,
      });
      const entity = await newUserModel.save();
      user.id = entity.id
      return user
    } catch (error: any) {
      if (error.code && error.code == '11000') {
        throw new DuplicateUser(user.email);
      }
      throw error;
    }
  }
}
