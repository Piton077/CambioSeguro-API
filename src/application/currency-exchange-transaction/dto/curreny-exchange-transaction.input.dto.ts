import { IsIn, IsNumber, Min, NotEquals } from 'class-validator';
import { TransactionTypeEnum } from 'src/domain/transaction/transaction_type';

export class CurrencyExchangeTransactionInputDTO {

  @IsIn(['venta', 'compra'])
  tipo_cambio: TransactionTypeEnum;

  @NotEquals(0)
  @Min(-1)
  @IsNumber({
    allowNaN: false
  })
  monto_enviar: number;
}
