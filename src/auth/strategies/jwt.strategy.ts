import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../Auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: process.env.JWT_IGNORE_EXPIRATION === 'YES',
    });
  }

  async validate(payload: { sub: string }) {
    if (!(await this.authService.verifyUserExists(payload.sub))) {
      throw new UnauthorizedException('User not found.');
    }

    return { id: payload.sub };
  }
}
