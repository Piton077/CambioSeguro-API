import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CurrencyExchangeAPIOuputDTO } from 'src/domain/ports/integrations/currency_exchange/dto/output/currency_exchange.api.output.dto';
import { CambioSeguroAPIService } from '../cambio_seguro.api';


describe('Cambio Seguro API ', () => {
    let service: CambioSeguroAPIService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: HttpService,
                useValue: {
                    get: jest.fn(() => of({
                        data:
                            { "error": false, "message": "Ok", "status": 200, "data": { "sunat_purchase_price": 3.736, "sunat_sale_price": 3.743, "status": true, "_id": "669eefe68807af13225dc7d1", "purchase_price": 3.7524, "sale_price": 3.7724, "purchase_price_comparative": 3.7319, "sale_price_comparative": 3.7853, "purchase_price_paralelo": 3.736, "sale_price_paralelo": 3.7885 } }
                    }
                    ))
                }
            }, CambioSeguroAPIService],
        }).compile();
        service = module.get<CambioSeguroAPIService>(CambioSeguroAPIService);
    });

    it('should return purchase price and sale price ', async () => {
        const expected: CurrencyExchangeAPIOuputDTO = { "purchase_price": 3.7524, "sale_price": 3.7724 }
        const response = await service.getRate()
        expect(response).toEqual(expected);
    });

});