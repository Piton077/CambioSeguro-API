import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './application/auth/auth.module';
import { CurrencyExchangeTransactionModule } from './application/currency-exchange-transaction/currency-exchange-transaction.module';
import { validationSchema } from './env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    CurrencyExchangeTransactionModule,
    LoggerModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
