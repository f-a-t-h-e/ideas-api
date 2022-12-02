import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (host.getType() === 'http') {
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
      if (exception.response) {
        response.send(exception.response);
      } else {
        response.send(errorResponse);
      }
      console.log('this is sent to user');

      Logger.error(
        `${request.method} ${url}`,
        JSON.stringify(errorResponse),
        'ExceptionFilter',
      );
      const getClassOf = Function.prototype.call.bind(
        Object.prototype.toString,
      );

      console.log('---------------------------');

      console.log(getClassOf(exception));

      console.log('This is for dev');

      console.log(exception.response);

      console.log('^-------------------------^');

      console.log(exception);

      console.log('from http-exception.filter ^');
    } else {
      // const ctx = GqlExecutionContext.create(host);
      console.log('Go to http-exception.filter');
    }
  }
}
