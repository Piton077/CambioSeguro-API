import { CurrencyExchangeAPIOuputDTO } from './dto/output/currency_exchange.api.output.dto';

export interface CurrencyExchangeAPI {
  getRate(): Promise<CurrencyExchangeAPIOuputDTO>;
}

export const CurrencyExchangeAPI = Symbol('CurrencyExchangeAPI');
