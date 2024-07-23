export class DomainEntity {
  private _id?: string;

  get id() {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }
}
