import { ConflictException, Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { hash, verify } from 'argon2';
import { AuthJwtPayload } from './types/jwtPayload';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import refreshConfig from './config/refresh.config';
import type { ConfigType } from '@nestjs/config';
import { retry } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly UserEntity: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(refreshConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshConfig>) { }
  async registerUser(user: CreateAuthDto) {
    const { password, ...other } = user;
    const hashedPassword = await hash(password);
    const newUser = this.UserEntity.create({ password: hashedPassword, ...other });
    await this.UserEntity.save(newUser)
  }
  async Login(userId: number, firstName?: string, lastName?: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRt = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRt)
    return {
      id: userId,
      firstName,
      lastName,
      accessToken,
      refreshToken
    }
  }
  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig)
    ])
    return {
      accessToken,
      refreshToken
    }
  }
  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException("user not found !!")
    const currentUser = { id: user.id, role: user.role };
    return currentUser
  }
  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.hashedRefreshToken) throw new UnauthorizedException("user not found !!")

    const refreshTokenMatched = verify(user?.hashedRefreshToken, refreshToken)
    if (!refreshTokenMatched) throw new UnauthorizedException('Invalid refresh token !')
    const currentUser = { id: user.id };
    return currentUser
  }
  async refreshToken(userId: number, firstName?: string, lastName?: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRT)
    return {
      id: userId,
      firstName,
      lastName,
      accessToken,
      refreshToken
    }
  }

  async signOut(userId: number) {

    return await this.userService.updateHashedRefreshToken(userId, null)

  }
}
