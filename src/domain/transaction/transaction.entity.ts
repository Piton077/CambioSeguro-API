import { DomainEntity } from '../base/domain.entity';
import { TransactionRateEntity } from './transaction_rate';
import { TransactionTypeEnum, TrasanctionType } from './transaction_type';

export class TransactionEntity extends DomainEntity {
  private _moneyToReceive: number;
  private _userId: string;

  constructor(
    private _transactionType: TrasanctionType,
    private _rate: TransactionRateEntity,
    private _moneyToSend: number,
  ) {
    super();
    this.calculateMoneyToReceive();
  }

  get rate() {
    return this._rate;
  }

  get type() {
    return this._transactionType;
  }
  get moneyToSend() {
    return this._moneyToSend;
  }
  get moneyToReceive() {
    return this._moneyToReceive;
  }

  set moneyToReceive(money: number) {
    this._moneyToReceive = money;
  }

  set userId(userId: string) {
    this._userId = userId;
  }
  get userId() {
    return this._userId;
  }

  private calculateMoneyToReceive() {
    switch (this._transactionType.value) {
      case TransactionTypeEnum.Purchase:
        this._moneyToReceive = Math.round(this._moneyToSend * this._rate.purchasePrice * 100) / 100;
        break;
      case TransactionTypeEnum.Sale:
        this._moneyToReceive = Math.round(this._moneyToSend / this._rate.salesPrice * 100) / 100;
        break;
    }
  }
}
