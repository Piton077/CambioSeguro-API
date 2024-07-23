export class NotFoundTransaction extends Error {
  constructor(id: string) {
    super(`No se encontró transacción : ${id}`);
    this.name = 'NotFoundTransaction';
  }
}
