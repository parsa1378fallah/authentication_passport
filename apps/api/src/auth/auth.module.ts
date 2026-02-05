import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import refreshConfig from './config/refresh.config';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { RefreshSterategy } from './strategies/refresh.token.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig)
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UserService, JwtStrategy, RefreshAuthGuard, RefreshSterategy],
})
export class AuthModule { }
