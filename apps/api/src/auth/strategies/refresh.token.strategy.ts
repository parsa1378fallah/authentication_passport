import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { AuthJwtPayload } from '../types/jwtPayload';
import type { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';
import { Request } from 'express';

@Injectable()
export class RefreshSterategy extends PassportStrategy(Strategy, "refresh-jwt") {
    constructor(@Inject(refreshConfig.KEY) private refreshConfiguration: ConfigType<typeof refreshConfig>,
        private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
            secretOrKey: refreshConfiguration.secret as string,
            ignoreExpiration: false,
            passReqToCallback: true
        })


    }
    async validate(req: Request, payload: AuthJwtPayload) {
        const userId = payload.sub;
        const refreshToken = req.body.refreshToken
        return await this.authService.validateRefreshToken(userId, refreshToken)
    }
}  