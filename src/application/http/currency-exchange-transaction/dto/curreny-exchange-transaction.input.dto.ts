import { TransactionTypeEnum } from 'src/domain/transaction/transaction_type';

export interface CurrencyExchangeTransactionInputDTO {
  tipo_cambio: TransactionTypeEnum;
  monto_enviar: number;
}
