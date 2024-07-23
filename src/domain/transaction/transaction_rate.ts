import { DomainEntity } from '../base/domain.entity';

export class TransactionRateEntity extends DomainEntity {
  constructor(private _purchasePrice: number, private _salePrice: number) {
    super();
  }
  get purchasePrice() {
    return this._purchasePrice;
  }
  get salesPrice() {
    return this._salePrice;
  }
}
