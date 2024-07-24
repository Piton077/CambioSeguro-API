import { CustomError } from "src/domain/base/error";

export class WrongPassword extends CustomError {
  constructor() {
    super(`Contraseña incorrecta`);
    this.name = 'WrongPassword';
  }
}
