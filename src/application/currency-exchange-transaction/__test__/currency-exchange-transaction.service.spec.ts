import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyExchangeAPI } from 'src/domain/ports/integrations/currency_exchange/currency_exchange.api';
import { TransactionRepository } from 'src/domain/ports/repository/transaction.repository';
import { UserRepository } from 'src/domain/ports/repository/user.repository';
import { TransactionNotFound } from 'src/domain/transaction/errors/transaction_not_found.error';
import { TransactionTypeEnum } from 'src/domain/transaction/transaction_type';
import { MongooseTransactionRepositoryMock, TransactionMock } from 'src/infrastructure/mongoose/__tests__/transaction.repository.mock';
import { CurrencyExchangeTransactionService } from '../currency-exchange-transaction.service';



describe('CurrencyExchangeTransactionService', () => {
    let service: CurrencyExchangeTransactionService;
    let transactionRepository: TransactionRepository
    let userRepository: UserRepository
    let currencyExchangeAPI: CurrencyExchangeAPI
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: TransactionRepository,
                useValue: {
                    deleteTransaction: jest.fn(() => { }),
                    save: jest.fn(),

                }
            },
            {
                provide: CurrencyExchangeAPI,
                useValue: {
                    getRate: jest.fn(() => { })
                }
            },
            {
                provide: UserRepository,
                useValue: {
                    findByEmail: jest.fn()
                }
            },
                CurrencyExchangeTransactionService],
        }).compile();
        currencyExchangeAPI = module.get<CurrencyExchangeAPI>(CurrencyExchangeAPI)
        service = module.get<CurrencyExchangeTransactionService>(CurrencyExchangeTransactionService);
        userRepository = module.get<UserRepository>(UserRepository)
        transactionRepository = module.get<TransactionRepository>(TransactionRepository)
    });

    describe('delete', () => {
        it('should return a transaction entity if it was sucessfully removed', async () => {
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
            const entity = MongooseTransactionRepositoryMock.restoreEntity(newMock)
            transactionRepository.deleteTransaction = jest.fn().mockResolvedValueOnce(entity)
            const response = await service.deleteTransactionById(newMock.id)
            expect(response).toEqual(entity);
        });
        it('should throw Transaction Not Found if no transaction with x id', async () => {

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
            transactionRepository.deleteTransaction = jest.fn().mockResolvedValueOnce(null)
            expect(service.deleteTransactionById(newMock.id)).rejects.toThrow(new TransactionNotFound(newMock.id))
        });
    })

    describe('create', () => {
        it('should return a transaction entity with money_to_receive = purchase_price * money_to_send if it the transaction is for purchase', async () => {
            const newMock: TransactionMock = {
                tipo_de_cambio: 'compra',
                tasa_de_cambio: {
                    purchase_price: 3.8,
                    sale_price: 3.75
                },
                monto_enviar: 100,
                monto_recibir: 100 * 3.8,
                id_usuario: "66a035cd7380e9191450e7db",
                id: ""
            }
            const entity = MongooseTransactionRepositoryMock.restoreEntity(newMock)
            entity.id = undefined
            currencyExchangeAPI.getRate = jest.fn().mockResolvedValueOnce({
                purchase_price: 3.8,
                sale_price: 3.75,
            })
            userRepository.findByEmail = jest.fn().mockResolvedValue({ email: 'josemoraleswatanabe@gmail.com', id: "66a035cd7380e9191450e7db" })
            transactionRepository.save = jest.fn().mockResolvedValueOnce(entity)
            await service.createNewTransaction("josemoraleswatanabe@gmail.com", {
                monto_enviar: 100.00,
                tipo_cambio: TransactionTypeEnum.Purchase
            })
            expect(transactionRepository.save).toBeCalledWith(entity);
        });

        it('should return a transaction entity with money_to_receive = money_to_send * sales_price if it the transaction is for sale', async () => {
            const newMock: TransactionMock = {
                tipo_de_cambio: 'venta',
                tasa_de_cambio: {
                    purchase_price: 3.8,
                    sale_price: 3.75
                },
                monto_enviar: 100,
                monto_recibir: 100 / 3.75,
                id_usuario: "66a035cd7380e9191450e7db",
                id: ""
            }
            const entity = MongooseTransactionRepositoryMock.restoreEntity(newMock)
            entity.id = undefined
            currencyExchangeAPI.getRate = jest.fn().mockResolvedValueOnce({
                purchase_price: 3.8,
                sale_price: 3.75,
            })
            userRepository.findByEmail = jest.fn().mockResolvedValue({ email: 'josemoraleswatanabe@gmail.com', id: "66a035cd7380e9191450e7db" })
            await service.createNewTransaction("josemoraleswatanabe@gmail.com", {
                monto_enviar: 100.00,
                tipo_cambio: TransactionTypeEnum.Sale
            })
            expect(transactionRepository.save).toBeCalledWith(entity);
        });

    })


    describe('getDetailsId', () => {
        it('should return a transaction details if theres a transaction with X id ', async () => {
            const newMock: TransactionMock = {
                tipo_de_cambio: 'compra',
                tasa_de_cambio: {
                    purchase_price: 3.8,
                    sale_price: 3.75
                },
                monto_enviar: 100,
                monto_recibir: 100 * 3.8,
                id_usuario: "66a035cd7380e9191450e7db",
                id: "id-entity"
            }
            const entity = MongooseTransactionRepositoryMock.restoreEntity(newMock)
            transactionRepository.findById = jest.fn().mockResolvedValueOnce(entity)
            const expected = {
                transaction: {
                    tipo_cambio: entity.type.value,
                    tasa_de_cambio: {
                        tasa_compra: entity.rate.purchasePrice,
                        tasa_venta: entity.rate.salesPrice,
                    },
                    monto_enviar: entity.moneyToSend,
                    monto_recibir: entity.moneyToReceive,
                    id: entity.id,
                },
            }
            const resp = await service.getDetailsByTransactionId(newMock.id)

            expect(resp).toEqual(expected)
        });

        it('should throw Transaction Not Found if theres no transaction with x id', async () => {
            const newMock: TransactionMock = {
                tipo_de_cambio: 'venta',
                tasa_de_cambio: {
                    purchase_price: 3.8,
                    sale_price: 3.75
                },
                monto_enviar: 100,
                monto_recibir: 100 / 3.75,
                id_usuario: "66a035cd7380e9191450e7db",
                id: "id-generado"
            }
            transactionRepository.findById = jest.fn().mockResolvedValueOnce(null)
            expect(service.getDetailsByTransactionId(newMock.id)).rejects.toThrow(new TransactionNotFound(newMock.id))
        });

    })

    describe('all paginated transaction', () => {
        it('should return a all paginated transaction  linked to a user  ', async () => {
            const newMock: TransactionMock = {
                tipo_de_cambio: 'compra',
                tasa_de_cambio: {
                    purchase_price: 3.8,
                    sale_price: 3.75
                },
                monto_enviar: 100,
                monto_recibir: 100 * 3.8,
                id_usuario: "66a035cd7380e9191450e7db",
                id: "id-entity"
            }
            const entity = MongooseTransactionRepositoryMock.restoreEntity(newMock)
            const transactions = [entity, entity]
            const limit = 2
            const currentPage = 1
            const totalItemStored = 10
            userRepository.findByEmail = jest.fn().mockResolvedValueOnce({ id: newMock.id_usuario })
            transactionRepository.paginateTransactions = jest.fn().mockResolvedValueOnce({
                total: totalItemStored,
                transactions
            })
            const totalPages = Math.floor((totalItemStored - 1) / limit) + 1;
            const expected = {
                data: transactions.map((t) => ({
                    tipo_cambio: t.type.value,
                    tasa_de_cambio: {
                        tasa_compra: t.rate.purchasePrice,
                        tasa_venta: t.rate.salesPrice,
                    },
                    monto_enviar: t.moneyToSend,
                    monto_recibir: t.moneyToReceive,
                    id: t.id,
                })),
                totalItems: transactions.length,
                totalPages,
                currentPage,
                total: totalItemStored,
            }
            const resp = await service.getAllPaginatedTransaction("josemoraleswatanabe@gmail.com", currentPage, limit)
            expect(resp).toEqual(expected)
        });



    })

});