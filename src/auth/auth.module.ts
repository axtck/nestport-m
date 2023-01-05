import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigHelper, IAuthConfig } from 'src/config/config.helper';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigHelper],
      useFactory: (configHelper: ConfigHelper) => {
        const authConfig: IAuthConfig = configHelper.getAuthConfig();
        return {
          secret: authConfig.jwtSecret,
          signOptions: {
            expiresIn: `${authConfig.jwtExpiry}s`,
          },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
