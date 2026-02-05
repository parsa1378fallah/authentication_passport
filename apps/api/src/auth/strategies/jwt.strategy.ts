import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { AuthJwtPayload } from '../types/jwtPayload';
import type { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(jwtConfig.KEY) private jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfiguration.secret as string,
            ignoreExpiration: false
        })


    }
    async validate(payload: AuthJwtPayload) {
        const userId = payload.sub;
        return await this.authService.validateJwtUser(userId)
    }
}  