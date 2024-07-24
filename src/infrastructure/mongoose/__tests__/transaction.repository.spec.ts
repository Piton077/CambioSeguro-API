import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Transaction } from '../schemas/transaction.schema';
import { MongooseTransactionRepository } from '../transaction.repository';
import { MongooseTransactionRepositoryMock, TransactionMock } from './transaction.repository.mock';


describe('Mongoose Transaction Repository ', () => {
    let repository: MongooseTransactionRepository;
    let mockMongoose: Model<Transaction>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: getModelToken(Transaction.name),
                useValue: MongooseTransactionRepositoryMock
            }, MongooseTransactionRepository],
        }).compile();
        mockMongoose = module.get<Model<Transaction>>(getModelToken(Transaction.name))
        repository = module.get<MongooseTransactionRepository>(MongooseTransactionRepository);
    });
    describe('findById', () => {
        it('should return an transaction entity plus id if theres a transaction with the same id ', async () => {
            const newMock: TransactionMock = {
                tipo_de_cambio: 'venta',
                tasa_de_cambio: {
                    purchase_price: 3.7524,
                    sale_price: 3.7724
                },
                monto_enviar: 200,
                monto_recibir: 750.48,
                id_usuario: "66a035cd7380e9191450e7db",
                id: "66a03fd90888718afde74590"
            }
            const expected = MongooseTransactionRepositoryMock.restoreEntity(newMock)
            MongooseTransactionRepositoryMock.setTransactions([newMock])
            const response = await repository.findById("66a03fd90888718afde74590")
            MongooseTransactionRepositoryMock.clearTransaction()
            expect(response).toEqual(expected);
        });
        it('should return null if no user holds x email', async () => {
            const email: string = "cucurella2@gmail.com"
            const response = await repository.findById(email)
            expect(response).toBeNull()
        });
    })

    describe('createTransaction', () => {
        it('should return an transaction entity if new transaction has just stored', async () => {
            const newMock: TransactionMock = {
                tipo_de_cambio: 'venta',
                tasa_de_cambio: {
                    purchase_price: 3.7524,
                    sale_price: 3.7724
                },
                monto_enviar: 200,
                monto_recibir: 750.48,
                id_usuario: "66a035cd7380e9191450e7db",
                id: ""
            }
            const entity = MongooseTransactionRepositoryMock.restoreEntity(newMock)
            const expected = MongooseTransactionRepositoryMock.restoreEntity(newMock)
            expected.id = "auto-generado"
            const response = await repository.save(entity)
            expect(response).toEqual(expected);
        });
    })

    describe('delete transaction', () => {
        it('should return a transaction entity if a transaction has been', async () => {
            const newMock: TransactionMock = {
                tipo_de_cambio: 'venta',
                tasa_de_cambio: {
                    purchase_price: 3.7524,
                    sale_price: 3.7724
                },
                monto_enviar: 200,
                monto_recibir: 750.48,
                id_usuario: "66a035cd7380e9191450e7db",
                id: "auto-generado"
            }
            MongooseTransactionRepositoryMock.setTransactions([newMock])
            const expected = MongooseTransactionRepositoryMock.restoreEntity(newMock)
            const response = await repository.deleteTransaction(newMock.id)
            MongooseTransactionRepositoryMock.clearTransaction()
            expect(response).toEqual(expected);
        });
        it('should return null if theres no transaction with specific id', async () => {
            const newMock: TransactionMock = {
                tipo_de_cambio: 'venta',
                tasa_de_cambio: {
                    purchase_price: 3.7524,
                    sale_price: 3.7724
                },
                monto_enviar: 200,
                monto_recibir: 750.48,
                id_usuario: "66a035cd7380e9191450e7db",
                id: "auto-generado"
            }
            const response = await repository.deleteTransaction(newMock.id)
            expect(response).toBeNull();
        });
    })

    describe('fetch all transaction', () => {
        it('should return all transactions linked to an user with pagination ', async () => {
            const newMock: TransactionMock = {
                tipo_de_cambio: 'venta',
                tasa_de_cambio: {
                    purchase_price: 3.7524,
                    sale_price: 3.7724
                },
                monto_enviar: 200,
                monto_recibir: 750.48,
                id_usuario: "66a035cd7380e9191450e7db",
                id: "auto-generado"
            }
            MongooseTransactionRepositoryMock.setTransactions([newMock])
            const entity = MongooseTransactionRepositoryMock.restoreEntity(newMock)
            const expected = {
                transactions: [entity],
                total: 1
            }
            const response = await repository.paginateTransactions(newMock.id_usuario, 0, 10)
            MongooseTransactionRepositoryMock.clearTransaction()
            expect(response).toEqual(expected);
        });
    })



});