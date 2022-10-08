import { ForbiddenError } from '@casl/ability';
import { EntityNotFoundError } from 'typeorm';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus: number;
    if (exception instanceof ForbiddenError) {
      httpStatus = HttpStatus.FORBIDDEN;
    } else if (exception instanceof EntityNotFoundError) {
      httpStatus = HttpStatus.NOT_FOUND;
    } else if (exception instanceof HttpException) {
      if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR) {
        httpStatus = HttpStatus.BAD_REQUEST;
      } else httpStatus = exception.getStatus();
    } else {
      // TODO: remove this
      httpStatus = HttpStatus.BAD_REQUEST;
    }

    const responseBody = {
      statusCode: httpStatus,
      message: exception instanceof Error ? exception.message : exception,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
