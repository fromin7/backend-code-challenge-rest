import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../Auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
      ignoreExpiration: process.env.JWT_IGNORE_EXPIRATION === 'YES',
    });
  }

  async validate(req: Request, payload: { sub: string }): Promise<{ id: string }> {
    if (!(await this.authService.verifyUserExists(payload.sub))) {
      throw new UnauthorizedException('User not found.');
    }

    return { id: payload.sub };
  }
}
