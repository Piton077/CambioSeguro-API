import { CustomError } from "src/domain/base/error";

export class DuplicateUser extends CustomError {
  constructor(email: string) {
    super(`Este email ya esta en uso: ${email}`);
    this.name = 'DuplicateUser';
  }
}
