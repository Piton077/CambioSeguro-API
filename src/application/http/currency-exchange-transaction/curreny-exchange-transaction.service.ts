import { Inject, Injectable } from '@nestjs/common';
import { CurrencyExchangeAPI } from 'src/domain/ports/integrations/currency_exchange/currency_exchange.api';
import { TransactionRepository } from 'src/domain/ports/repository/transaction.repository';
import { UserRepository } from 'src/domain/ports/repository/user.repository';
import { NotFoundTransaction } from 'src/domain/transaction/errors/not_found_transaction.error';
import { TransactionEntity } from 'src/domain/transaction/transaction.entity';
import { TransactionRateEntity } from 'src/domain/transaction/transaction_rate';
import { TrasanctionType } from 'src/domain/transaction/transaction_type';
import { CurrencyExchangeTransactionInputDTO } from './dto/curreny-exchange-transaction.input.dto';

@Injectable()
export class CurrencyExchangeTransactionService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(CurrencyExchangeAPI)
    private readonly currencyExchangeAPI: CurrencyExchangeAPI,
    @Inject(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async createNewTransaction(
    email: string,
    input: CurrencyExchangeTransactionInputDTO,
  ) {
    const user = await this.userRepository.findByEmail(email);
    const rate = await this.currencyExchangeAPI.getRate();
    const transactionType = TrasanctionType.create(input.tipo_cambio);
    const transactionRate = new TransactionRateEntity(
      rate.purchase_price,
      rate.sale_price,
    );
    const transaction = new TransactionEntity(
      transactionType,
      transactionRate,
      input.monto_enviar,
    );
    transaction.userId = user.id;
    this.transactionRepository.save(transaction);
  }

  async getAllPaginatedTransaction(email: string, currentPage = 1, limit = 8) {
    const user = await this.userRepository.findByEmail(email);
    const { total, transactions } =
      await this.transactionRepository.paginateTransactions(
        user.id,
        currentPage - 1,
        limit,
      );
    const totalPages = Math.floor((total - 1) / limit) + 1;
    return {
      data: transactions.map((t) => ({
        tipo_cambio: t.type.value,
        tasa_de_cambio: {
          tasa_compra: t.rate.purchasePrice,
          tasa_venta: t.rate.salesPrice,
        },
        monto_enviar: t.moneyToSend,
        monto_recibir: t.moneyToReceive,
        id: t.id,
      })),
      totalItems: transactions.length,
      totalPages,
      currentPage: +currentPage,
      total,
    };
  }

  async getDetailsByTransactionId(transactionId: string) {
    const transaction = await this.transactionRepository.findById(
      transactionId,
    );
    return {
      transaction: {
        tipo_cambio: transaction.type.value,
        tasa_de_cambio: {
          tasa_compra: transaction.rate.purchasePrice,
          tasa_venta: transaction.rate.salesPrice,
        },
        monto_enviar: transaction.moneyToSend,
        monto_recibir: transaction.moneyToReceive,
        id: transaction.id,
      },
    };
  }

  async deleteTransactionById(transactionId: string) {
    const transaction = await this.transactionRepository.deleteTransaction(
      transactionId,
    );
    if (!transaction) {
      throw new NotFoundTransaction(transactionId);
    }
  }
}
