import { CustomError } from "src/domain/base/error";

export class TransactionCorrupted extends CustomError {
    constructor(message: string) {
        super(message);
        this.name = 'TransactionCorrupted';
    }
}
