export class WrongPassword extends Error {
  constructor() {
    super(`Contraseña incorrecta`);
    this.name = 'WrongPassword';
  }
}
