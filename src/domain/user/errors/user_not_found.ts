import { CustomError } from "src/domain/base/error";

export class UserNotFound extends CustomError {
  constructor(email: string) {
    super(`No se encontro usuario con email : ${email}`);
    this.name = 'UserNotFound';
  }
}
