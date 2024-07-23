import { TransactionEntity } from 'src/domain/transaction/transaction.entity';

export interface TransactionRepository {
  deleteTransaction(transactionId: string): Promise<TransactionEntity | null>;
  save(transaction: TransactionEntity): Promise<void>;
  findById(transactionId: string): Promise<TransactionEntity | null>;
  paginateTransactions(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<{ transactions: TransactionEntity[]; total: number }>;
}

export const TransactionRepository = Symbol('TransactionRepository');
