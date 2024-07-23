export enum TransactionTypeEnum {
  Purchase = 'compra',
  Sale = 'venta',
}

export class TrasanctionType {
  value: TransactionTypeEnum;

  constructor(transactionType: TransactionTypeEnum) {
    this.value = transactionType;
  }
  static create(transactionType: TransactionTypeEnum) {
    if (!Object.values(TransactionTypeEnum).includes(transactionType)) {
      throw new Error('Solo se acepta compra o venta');
    }
    return new TrasanctionType(transactionType);
  }
}
