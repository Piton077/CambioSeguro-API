import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationMailService } from 'src/domain/ports/integrations/mailer/mailer.service';
import { UserRepository } from 'src/domain/ports/repository/user.repository';
import {
  User,
  UserSchema,
} from 'src/infrastructure/mongoose/schemas/user.schema';
import { MongooseUserRepository } from 'src/infrastructure/mongoose/user.repository';
import { NodemailerModule } from 'src/infrastructure/nodemailer/nodemailer.module';
import { NodeMailerService } from 'src/infrastructure/nodemailer/nodemailer.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('TOKEN_PROVIDER_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('TOKEN_PROVIDER_EXPIRATION_PERIOD'),
        },
      }),
    }),
    NodemailerModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    { provide: UserRepository, useClass: MongooseUserRepository },
    { provide: NotificationMailService, useClass: NodeMailerService },
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
