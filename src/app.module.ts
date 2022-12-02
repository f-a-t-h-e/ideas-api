import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { Idea } from './modules/idea/entities/idea.entity';
import { User } from './modules/user/entities/user.entity';
import { Comment } from './modules/comment/entities/comment.entity';

import { AppController } from './app.controller';

import { UserModule } from './modules/user/user.module';
import { IdeaModule } from './modules/idea/idea.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';

import { LoggingInterceptor } from './shared/logger/logging.interceptor';
import { HttpErrorFilter } from './shared/http-exception.filter';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot(/*{
      validationSchema: Joi.object({
        //...
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }*/),
    TypeOrmModule.forRoot({
      // logging: true,
      // dropSchema: true,
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'psqlpasscode',
      database: 'ideas',
      entities: [Idea, User, Comment],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      context: ({ req }: any) => ({ req }), // YOU may need it for cookies
      cors: {
        // You need this for cookies
        origin: 'http://localhost:3000',
        credentials: true, // YOU need this for cookies
      },
      formatError: (error: any) => {
        // format error ---TO_DO--- handle errors instead (for better user experience)
        const graphQLFormattedError = {
          message:
            error.extensions?.exception?.response?.message || error.message,
          code: error.extensions?.code || 'SERVER_ERROR',
          name: error.extensions?.exception?.name || error.name,
        };
        return graphQLFormattedError;
      },
    }),
    IdeaModule,
    UserModule,
    AuthModule,
    CommentModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
