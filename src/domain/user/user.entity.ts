import { DomainEntity } from '../base/domain.entity';

export class UserEntity extends DomainEntity {
  constructor(private _email: string, private _password: string) {
    super();
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }
}
