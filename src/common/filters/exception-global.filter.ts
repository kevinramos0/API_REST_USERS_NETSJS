import {
  Catch,
  ArgumentsHost,
  Inject,
  HttpServer,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(@Inject(HttpAdapterHost) applicationRef: HttpServer) {
    super(applicationRef);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof Error ? exception.message : exception.message.error;

    let detail: string;

    /** CODIGOS EN POSTGRES */
    enum PostgresErrorCode {
      UniqueViolation = 23505,
      CheckViolation = 23514,
      NotNullViolation = 23502,
      ForeignKeyViolation = 23503,
      ColumnNotExist = 42703,
      GroupByError = 42803,
      SintaxisQueryError = 42601,
    }

    if (exception.response !== undefined) {
      message = exception.response.message;
    }

    if (exception.status === HttpStatus.NOT_FOUND) {
      status = HttpStatus.NOT_FOUND;
    }

    if (exception.status === HttpStatus.BAD_REQUEST) {
      status = HttpStatus.BAD_REQUEST;
    }

    if (exception.status === HttpStatus.FORBIDDEN) {
      status = HttpStatus.FORBIDDEN;
    }

    if (exception.status === HttpStatus.UNAUTHORIZED) {
      status = HttpStatus.UNAUTHORIZED;
    }

    if (!exception.status) {
      //cod key for value colunm table duplicaded
      // if (exception.code === '23505') {
      if (PostgresErrorCode[exception.code]) {
        status = 409;
        message = exception.message;
        detail = exception.detail;
      }
    }

    response.status(status).json({
      status,
      success: false,
      message,
      detail:
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Please contact with a admin of system.'
          : status == HttpStatus.CONFLICT
          ? detail
          : '',
    });
  }
}
