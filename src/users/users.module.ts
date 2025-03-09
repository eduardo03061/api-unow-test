import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenMiddleware } from 'src/middlewares/refresh-token.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RefreshTokenMiddleware)
      .forRoutes(
        { path: 'users/refresh', method: RequestMethod.POST },
        { path: 'users/metrics', method: RequestMethod.GET },
        { path: '/:id', method: RequestMethod.PATCH },
        { path: '/:id', method: RequestMethod.DELETE },
      );
  }
}
