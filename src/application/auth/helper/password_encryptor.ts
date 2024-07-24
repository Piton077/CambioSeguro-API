import { compareSync, hashSync } from "bcryptjs";

export class PasswordEncryptor {

    static comparePassword(inputPassword: string, userPassword: string) {
        return compareSync(inputPassword, userPassword);
    }
    static getHashPassword(password: string) {
        return hashSync(password, +process.env.PASSWORD_ENCRYPTION_ROUNDS)
    }
}