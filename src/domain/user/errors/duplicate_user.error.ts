export class DuplicateUser extends Error {
  constructor(email: string) {
    super(`Este email ya esta en uso: ${email}`);
    this.name = 'DuplicateUser';
  }
}
