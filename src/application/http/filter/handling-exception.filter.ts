import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NotFoundTransaction } from 'src/domain/transaction/errors/not_found_transaction.error';
import { DuplicateUser } from 'src/domain/user/errors/duplicate_user.error';
import { NotFoundUser } from 'src/domain/user/errors/not_found_user.error';
import { WrongPassword } from 'src/domain/user/errors/wrong_password';

@Catch(Error)
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
    if (exception instanceof NotFoundTransaction) {
      return HttpStatus.NOT_FOUND;
    }
    if (exception instanceof WrongPassword) {
      return HttpStatus.UNAUTHORIZED;
    }
    if (exception instanceof NotFoundUser) {
      return HttpStatus.NOT_FOUND;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
