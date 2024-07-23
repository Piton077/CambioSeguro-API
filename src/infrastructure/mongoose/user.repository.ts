import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserEntity } from 'src/domain/user.entity';
import { UserRepository } from 'src/domain/user.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class MongooseUserRepository implements UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.userModel.findOne({ email }).exec()
        if (!user) return null;
        const entity = new UserEntity(user.email, user.password);
        entity.id = user._id
        return entity;
    }

    async save(user: UserEntity): Promise<void> {
        const newUser = new this.userModel({
            username: user.username,
            password: user.password,
        });
        await newUser.save();
    }
}
