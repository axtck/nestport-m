import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './files/files.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    DatabaseModule,
    EventEmitterModule.forRoot(),
    FilesModule,
    ProfilesModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
