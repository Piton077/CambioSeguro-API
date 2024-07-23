import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CurrencyExchangeAPI } from 'src/domain/ports/integrations/currency_exchange/currency_exchange.api';
import { CurrencyExchangeAPIOuputDTO } from 'src/domain/ports/integrations/currency_exchange/dto/output/currency_exchange.api.output.dto';

@Injectable()
export class CambioSeguroAPIService implements CurrencyExchangeAPI {
  constructor(private readonly httpService: HttpService) {}

  async getRate(): Promise<CurrencyExchangeAPIOuputDTO> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${process.env.CAMBIO_SEGURO_API_URL}/config/rates`),
    );
    return {
      purchase_price: data['data']['purchase_price'],
      sale_price: data['data']['sale_price'],
    };
  }
}
