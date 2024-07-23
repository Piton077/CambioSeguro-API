import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyExchangeAPI } from 'src/domain/ports/integrations/currency_exchange/currency_exchange.api';
import { TransactionRepository } from 'src/domain/ports/repository/transaction.repository';
import { UserRepository } from 'src/domain/ports/repository/user.repository';
import { CambioSeguroAPIService } from 'src/infrastructure/cambio_seguro/cambio_seguro.api';
import {
  Transaction,
  TransactionSchema,
} from 'src/infrastructure/mongoose/schemas/transaction.schema';
import {
  User,
  UserSchema,
} from 'src/infrastructure/mongoose/schemas/user.schema';
import { MongooseTransactionRepository } from 'src/infrastructure/mongoose/transaction.repository';
import { MongooseUserRepository } from 'src/infrastructure/mongoose/user.repository';
import { CurrencyExchangeTransactionController } from './currency-exchange-transaction.controller';
import { CurrencyExchangeTransactionService } from './curreny-exchange-transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    HttpModule,
  ],
  providers: [
    { provide: UserRepository, useClass: MongooseUserRepository },
    { provide: TransactionRepository, useClass: MongooseTransactionRepository },
    { provide: CurrencyExchangeAPI, useClass: CambioSeguroAPIService },
    CurrencyExchangeTransactionService,
  ],
  controllers: [CurrencyExchangeTransactionController],
})
export class CurrencyExchangeTransactionModule {}
