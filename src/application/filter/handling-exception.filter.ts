import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomError } from 'src/domain/base/error';
import { TransactionCorrupted } from 'src/domain/transaction/errors/transaction_corrupted.error';
import { TransactionNotFound } from 'src/domain/transaction/errors/transaction_not_found.error';
import { DuplicateUser } from 'src/domain/user/errors/duplicate_user.error';
import { UserNotFound } from 'src/domain/user/errors/user_not_found';
import { WrongPassword } from 'src/domain/user/errors/wrong_password';

@Catch(CustomError)
export class HandlingExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = this.mapToHttpCode(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
  mapToHttpCode(exception: Error) {
    if (exception instanceof DuplicateUser) {
      return HttpStatus.CONFLICT;
    }
    if (exception instanceof TransactionNotFound) {
      return HttpStatus.NOT_FOUND;
    }
    if (exception instanceof WrongPassword) {
      return HttpStatus.UNAUTHORIZED;
    }
    if (exception instanceof UserNotFound) {
      return HttpStatus.NOT_FOUND;
    }
    if (exception instanceof TransactionCorrupted) {
      return HttpStatus.CONFLICT;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
