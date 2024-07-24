import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard';
import { CurrencyExchangeTransactionService } from './currency-exchange-transaction.service';
import { CurrencyExchangeTransactionInputDTO } from './dto/curreny-exchange-transaction.input.dto';

@UseGuards(AuthGuard)
@Controller('transaction')
export class CurrencyExchangeTransactionController {
  constructor(private service: CurrencyExchangeTransactionService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createTransaction(@Request() request: any, @Body() body: CurrencyExchangeTransactionInputDTO) {
    await this.service.createNewTransaction(
      request.user.email,
      body
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @Get('/:id')
  async getDetails(@Param('id') id: string) {
    return this.service.getDetailsByTransactionId(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllPaginatedTransactions(
    @Query() { limit, page },
    @Req() request: any,
  ) {
    return this.service.getAllPaginatedTransaction(
      request.user.email,
      page,
      limit,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteTransaction(@Param('id') id: string) {
    await this.service.deleteTransactionById(id);
  }
}
