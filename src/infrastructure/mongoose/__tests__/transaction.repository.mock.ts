import { TransactionEntity } from "src/domain/transaction/transaction.entity";
import { TransactionRateEntity } from "src/domain/transaction/transaction_rate";
import { TransactionTypeEnum, TrasanctionType } from "src/domain/transaction/transaction_type";
import { MongooseErrorMock } from "./errors/mock.error";

export interface CurrencyExchangeRateMock {
    purchase_price: number;

    sale_price: number;
}

export interface TransactionMock {
    id: string
    tipo_de_cambio: string;

    tasa_de_cambio: CurrencyExchangeRateMock;

    monto_enviar: number;

    monto_recibir: number;

    id_usuario: string;
}




export class MongooseTransactionRepositoryMock {

    static transactions: TransactionMock[] = []

    public state: TransactionMock

    constructor(info?: TransactionMock) {
        if (info) {
            this.state = info
        }
    }
    async save() {
        const entity = await MongooseTransactionRepositoryMock.findById(this.state.id).exec()
        if (entity) {
            throw new MongooseErrorMock('11000')
        }
        return Promise.resolve({
            ...this.state,
            id: 'auto-generado'
        })
    }


    static find({ id_usuario }: { id_usuario: string }) {
        return {
            countDocuments() {
                return {
                    exec() {
                        return Promise.resolve(MongooseTransactionRepositoryMock.transactions.filter((t) => t.id_usuario == id_usuario).length)
                    }
                }
            },
            limit(limit: number) {
                return {
                    skip(skip: number) {
                        return {
                            exec() {
                                return Promise.resolve(MongooseTransactionRepositoryMock.transactions.filter((t) => t.id_usuario == id_usuario))
                            }
                        }
                    }
                }

            }
        }
    }

    static findById(id: string) {

        return {
            exec: () => {
                return Promise.resolve(this.transactions.find(u => u.id == id))
            }
        }
    }
    static clearTransaction() {
        this.transactions = []
    }
    static setTransactions(transactions: TransactionMock[]) {
        this.transactions = transactions
    }

    static findByIdAndDelete(id: string) {
        return {
            exec: async () => {
                const entity = await this.findById(id).exec()
                if (!entity) return null
                return entity
            }
        }

    }

    static restoreEntity(mock: TransactionMock) {
        const transactionType = TrasanctionType.create(
            mock.tipo_de_cambio as TransactionTypeEnum,
        );
        const transactionRate = new TransactionRateEntity(
            mock.tasa_de_cambio.purchase_price,
            mock.tasa_de_cambio.sale_price,
        );
        const entity = new TransactionEntity(
            transactionType,
            transactionRate,
            mock.monto_enviar,
        );
        entity.id = mock.id;
        entity.userId = mock.id_usuario.toString();
        return entity;
    }

}

