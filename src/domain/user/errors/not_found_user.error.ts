export class NotFoundUser extends Error {
  constructor(email: string) {
    super(`No se encontro usuario con email : ${email}`);
    this.name = 'NotFoundUser';
  }
}
