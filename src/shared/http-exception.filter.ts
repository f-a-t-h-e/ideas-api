import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { url } from 'inspector';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const url = request.originalUrl;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const msg =
      exception.message.message ||
      exception.message.error ||
      exception.message ||
      null;

    const errorResponse = {
      statusCode: status,
      msg,
      method: request.method,
      path: url,
      success: false,
      data: null,
    };

    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);

    Logger.error(
      `${request.method} ${url}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    );
  }
}
