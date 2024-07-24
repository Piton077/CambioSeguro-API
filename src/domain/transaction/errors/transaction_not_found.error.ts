import { CustomError } from "src/domain/base/error";

export class TransactionNotFound extends CustomError {
  constructor(id: string) {
    super(`No se encontró transacción : ${id}`);
    this.name = 'TransactionNotFound';
  }
}
