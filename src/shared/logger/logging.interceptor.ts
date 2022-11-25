import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();
    if (req) {
      const method = req.method;
      const url = req.url;

      return next
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `${method} ${url} ${Date.now() - now}ms`,
              context.getClass().name,
            ),
          ),
        );
    } else {
      const ctx: any = GqlExecutionContext.create(context);

      const resolverName = ctx.constructorRef.name;
      const info = ctx.getInfo();
      // console.log(ctx);

      return next
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `${info.parentType} "${info.fieldName}" ${Date.now() - now}ms`,
              resolverName,
            ),
          ),
        );
    }
  }
}
