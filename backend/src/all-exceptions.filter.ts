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

    let responseBody: any = {
      message: exception instanceof Error ? exception.message : exception,
    };

    let status: number;
    if (exception instanceof ForbiddenError) {
      responseBody.statusCode = HttpStatus.FORBIDDEN;
      status = HttpStatus.FORBIDDEN;
    } else if (exception instanceof EntityNotFoundError) {
      responseBody.statusCode = HttpStatus.NOT_FOUND;
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof HttpException) {
      responseBody = exception.getResponse();
      status = exception.getStatus();
    } else {
      responseBody.statusCode = HttpStatus.BAD_REQUEST;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
