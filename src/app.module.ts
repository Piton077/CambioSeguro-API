import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './application/http/auth/auth.module';
import { CurrencyExchangeTransactionModule } from './application/http/currency-exchange-transaction/currency-exchange-transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    CurrencyExchangeTransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
