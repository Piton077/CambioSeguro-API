import {
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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard';
import { CurrencyExchangeTransactionService } from './curreny-exchange-transaction.service';

@UseGuards(AuthGuard)
@Controller('transaction')
export class CurrencyExchangeTransactionController {
  constructor(private service: CurrencyExchangeTransactionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createTransaction(@Request() request: any) {
    return await this.service.createNewTransaction(
      request.user.email,
      request.body,
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
  deleteTransaction(@Param('id') id: string) {
    return this.service.deleteTransactionById(id);
  }
}
