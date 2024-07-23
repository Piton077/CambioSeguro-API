import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TransactionRepository } from 'src/domain/ports/repository/transaction.repository';
import { TransactionEntity } from 'src/domain/transaction/transaction.entity';
import { TransactionRateEntity } from 'src/domain/transaction/transaction_rate';
import {
  TransactionTypeEnum,
  TrasanctionType,
} from 'src/domain/transaction/transaction_type';
import { Transaction } from './schemas/transaction.schema';

@Injectable()
export class MongooseTransactionRepository implements TransactionRepository {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async deleteTransaction(
    transactionId: string,
  ): Promise<TransactionEntity | null> {
    const response = await this.transactionModel
      .findByIdAndDelete(transactionId)
      .exec();
    if (!response) return null;
    return this.restoreTransaction(response);
  }

  async findById(transactionId: string): Promise<TransactionEntity> {
    const restoredTransaction = await this.transactionModel
      .findById(transactionId)
      .exec();
    return this.restoreTransaction(restoredTransaction);
  }

  async paginateTransactions(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<{ transactions: TransactionEntity[]; total: number }> {
    const count = await this.transactionModel
      .find({ id_usuario: userId })
      .countDocuments({})
      .exec();
    const data = await this.transactionModel
      .find({ id_usuario: userId })
      .limit(limit)
      .skip(skip)
      .exec();
    return {
      transactions: data.map(this.restoreTransaction),
      total: count,
    };
  }

  async save(transaction: TransactionEntity): Promise<void> {
    const document = new this.transactionModel({
      tipo_de_cambio: transaction.type.value,
      tasa_de_cambio: {
        purchase_price: transaction.rate.purchasePrice,
        sale_price: transaction.rate.salesPrice,
      },
      monto_enviar: transaction.moneyToSend,
      monto_recibir: transaction.moneyToReceive,
      id_usuario: transaction.userId,
    });

    await document.save();
  }

  private restoreTransaction(transaction: Transaction) {
    const transactionType = TrasanctionType.create(
      transaction.tipo_de_cambio as TransactionTypeEnum,
    );
    const transactionRate = new TransactionRateEntity(
      transaction.tasa_de_cambio.purchase_price,
      transaction.tasa_de_cambio.sale_price,
    );
    const entity = new TransactionEntity(
      transactionType,
      transactionRate,
      transaction.monto_enviar,
    );
    entity.id = transaction.id;
    entity.userId = transaction.id_usuario.toString();
    return entity;
  }
}
