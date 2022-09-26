import { ForbiddenError } from '@casl/ability';
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
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
    } else if (exception instanceof ForbiddenError) {
      httpStatus = HttpStatus.FORBIDDEN;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const responseBody = {
      statusCode: httpStatus,
      message: exception instanceof Error ? exception.message : exception,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
